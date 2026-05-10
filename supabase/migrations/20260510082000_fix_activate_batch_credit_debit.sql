-- ANSAKA OAM Insight — Fix batch activation credit debit
-- Credit balance is stored per user profile, so activation should debit the
-- authenticated corporate admin who owns the batch, not every admin in the org.

create or replace function public.activate_batch(p_batch_id uuid)
returns public.survey_batches
language plpgsql
security definer
set search_path = public
as $$
declare
  v_batch public.survey_batches;
  v_credit integer;
begin
  select * into v_batch
    from public.survey_batches
   where id = p_batch_id
   for update;

  if not found then
    raise exception 'Batch tidak ditemukan.' using errcode = 'P0002';
  end if;

  if not (public.is_super_admin(auth.uid())
       or v_batch.organization_id = public.user_org(auth.uid())) then
    raise exception 'Akses ditolak.' using errcode = '42501';
  end if;

  if v_batch.status = 'active' then
    return v_batch;
  end if;

  if v_batch.status <> 'draft' then
    raise exception 'Batch hanya bisa diaktifkan dari status Draft.' using errcode = '23514';
  end if;

  if v_batch.credits_allocated <= 0 then
    raise exception 'Alokasikan kredit terlebih dahulu sebelum mengaktifkan batch.'
      using errcode = '23514';
  end if;

  update public.users
     set credit_balance = credit_balance - v_batch.credits_allocated,
         updated_at = now()
   where id = auth.uid()
     and organization_id = v_batch.organization_id
     and credit_balance >= v_batch.credits_allocated
  returning credit_balance into v_credit;

  if v_credit is null then
    raise exception 'Saldo kredit tidak mencukupi.' using errcode = '23514';
  end if;

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
