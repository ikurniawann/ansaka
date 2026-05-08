-- =============================================================================
-- ANSAKA OAM Insight — RPCs (Migration 0006)
-- =============================================================================
-- 1. get_survey_by_token  — public, returns batch + divisions by token
-- 2. compute_batch_results — auth, aggregates per-respondent scores → batch_results
-- 3. close_batch           — auth, closes batch + triggers compute

-- =============================================================================
-- 1. get_survey_by_token
-- =============================================================================
create or replace function public.get_survey_by_token(p_token text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_batch record;
  v_divisions json;
begin
  select * into v_batch
    from public.survey_batches
   where unique_link_token = p_token
     and status = 'active';

  if not found then
    raise exception 'Survey tidak ditemukan atau sudah tidak aktif.'
      using errcode = 'P0002';
  end if;

  select json_agg(json_build_object('id', id, 'name', name) order by name)
    into v_divisions
    from public.divisions
   where organization_id = v_batch.organization_id;

  return json_build_object(
    'batch_id',          v_batch.id,
    'batch_name',        coalesce(v_batch.name, 'Survey Assessment'),
    'credits_remaining', greatest(v_batch.credits_allocated - v_batch.credits_used, 0),
    'divisions',         coalesce(v_divisions, '[]'::json)
  );
end;
$$;

revoke all on function public.get_survey_by_token(text) from public;
grant execute on function public.get_survey_by_token(text) to anon, authenticated;

-- =============================================================================
-- 2. compute_batch_results
-- =============================================================================
create or replace function public.compute_batch_results(p_batch_id uuid)
returns public.batch_results
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id  uuid;
  v_count   integer;
  v_result  public.batch_results;
  v_overall numeric;
begin
  -- Authorization check
  select organization_id into v_org_id
    from public.survey_batches
   where id = p_batch_id;

  if not found then
    raise exception 'Batch tidak ditemukan.' using errcode = 'P0002';
  end if;

  if not (public.is_super_admin(auth.uid())
       or v_org_id = public.user_org(auth.uid())) then
    raise exception 'Akses ditolak.' using errcode = '42501';
  end if;

  select count(*) into v_count
    from public.survey_responses
   where batch_id = p_batch_id and response_status = 'complete';

  if v_count = 0 then
    raise exception 'Belum ada respons yang lengkap.' using errcode = 'P0001';
  end if;

  -- Aggregate: average each JSON key across all complete responses
  insert into public.batch_results
    (batch_id, driver_scores, fp_scores, layer_scores, gap_scores,
     overall_score, maturity_level, respondent_count, computed_at)
  select
    p_batch_id,

    -- driver_scores
    (select jsonb_object_agg(key, round(avg_val::numeric, 4))
       from (select key, avg(value::text::numeric) as avg_val
               from public.survey_responses sr,
                    jsonb_each_text(sr.driver_scores) kv
              where sr.batch_id = p_batch_id
                and sr.response_status = 'complete'
                and sr.driver_scores is not null
              group by key) t),

    -- fp_scores
    (select jsonb_object_agg(key, round(avg_val::numeric, 4))
       from (select key, avg(value::text::numeric) as avg_val
               from public.survey_responses sr,
                    jsonb_each_text(sr.fp_scores) kv
              where sr.batch_id = p_batch_id
                and sr.response_status = 'complete'
                and sr.fp_scores is not null
              group by key) t),

    -- layer_scores
    (select jsonb_object_agg(key, round(avg_val::numeric, 4))
       from (select key, avg(value::text::numeric) as avg_val
               from public.survey_responses sr,
                    jsonb_each_text(sr.layer_scores) kv
              where sr.batch_id = p_batch_id
                and sr.response_status = 'complete'
                and sr.layer_scores is not null
              group by key) t),

    -- gap_scores
    (select jsonb_object_agg(key, round(avg_val::numeric, 4))
       from (select key, avg(value::text::numeric) as avg_val
               from public.survey_responses sr,
                    jsonb_each_text(sr.gap_scores) kv
              where sr.batch_id = p_batch_id
                and sr.response_status = 'complete'
                and sr.gap_scores is not null
              group by key) t),

    0.0,
    'computing',
    v_count,
    now()

  on conflict (batch_id) do update
    set driver_scores   = excluded.driver_scores,
        fp_scores       = excluded.fp_scores,
        layer_scores    = excluded.layer_scores,
        gap_scores      = excluded.gap_scores,
        overall_score   = excluded.overall_score,
        maturity_level  = excluded.maturity_level,
        respondent_count = excluded.respondent_count,
        computed_at     = excluded.computed_at
  returning * into v_result;

  -- Compute overall_score from averaged driver_scores
  select round(avg(value::text::numeric)::numeric, 4)
    into v_overall
    from jsonb_each_text(v_result.driver_scores);

  update public.batch_results
     set overall_score  = v_overall,
         maturity_level = case
           when v_overall >= 3.5 then 'Strong'
           when v_overall >= 2.8 then 'Stable'
           when v_overall >= 2.0 then 'Weak'
           else 'Critical'
         end
   where batch_id = p_batch_id
  returning * into v_result;

  return v_result;
end;
$$;

revoke all on function public.compute_batch_results(uuid) from public;
grant execute on function public.compute_batch_results(uuid) to authenticated;

-- Allow corporate_admin to upsert batch_results via this RPC (security definer handles it)
-- Also allow batch owner to close batch:

-- =============================================================================
-- 3. close_batch
-- =============================================================================
create or replace function public.close_batch(p_batch_id uuid)
returns public.survey_batches
language plpgsql
security definer
set search_path = public
as $$
declare
  v_batch   public.survey_batches;
begin
  select * into v_batch
    from public.survey_batches
   where id = p_batch_id;

  if not found then
    raise exception 'Batch tidak ditemukan.' using errcode = 'P0002';
  end if;

  if not (public.is_super_admin(auth.uid())
       or v_batch.organization_id = public.user_org(auth.uid())) then
    raise exception 'Akses ditolak.' using errcode = '42501';
  end if;

  if v_batch.status = 'closed' then
    raise exception 'Batch sudah ditutup.' using errcode = '23505';
  end if;

  update public.survey_batches
     set status    = 'closed',
         closed_at = now()
   where id = p_batch_id
  returning * into v_batch;

  return v_batch;
end;
$$;

revoke all on function public.close_batch(uuid) from public;
grant execute on function public.close_batch(uuid) to authenticated;

-- =============================================================================
-- 4. activate_batch
-- =============================================================================
create or replace function public.activate_batch(p_batch_id uuid)
returns public.survey_batches
language plpgsql
security definer
set search_path = public
as $$
declare
  v_batch  public.survey_batches;
  v_credit integer;
begin
  select * into v_batch
    from public.survey_batches
   where id = p_batch_id;

  if not found then
    raise exception 'Batch tidak ditemukan.' using errcode = 'P0002';
  end if;

  if not (public.is_super_admin(auth.uid())
       or v_batch.organization_id = public.user_org(auth.uid())) then
    raise exception 'Akses ditolak.' using errcode = '42501';
  end if;

  -- Check that credits_allocated > 0
  if v_batch.credits_allocated <= 0 then
    raise exception 'Alokasikan kredit terlebih dahulu sebelum mengaktifkan batch.'
      using errcode = '23514';
  end if;

  -- Deduct from organization credit_balance
  update public.users
     set credit_balance = credit_balance - v_batch.credits_allocated
   where organization_id = v_batch.organization_id
     and role = 'corporate_admin'
  returning credit_balance into v_credit;

  if v_credit is null or v_credit < 0 then
    -- rollback by raising exception
    raise exception 'Saldo kredit tidak mencukupi.' using errcode = '23514';
  end if;

  -- Log transaction
  insert into public.credit_transactions
    (organization_id, user_id, type, amount, batch_id, notes)
  values
    (v_batch.organization_id, auth.uid(), 'allocate',
     -v_batch.credits_allocated, p_batch_id,
     'Credit allocated for batch activation');

  update public.survey_batches
     set status = 'active'
   where id = p_batch_id
  returning * into v_batch;

  return v_batch;
end;
$$;

revoke all on function public.activate_batch(uuid) from public;
grant execute on function public.activate_batch(uuid) to authenticated;
