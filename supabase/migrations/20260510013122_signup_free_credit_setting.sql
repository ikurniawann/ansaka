-- =============================================================================
-- ANSAKA OAM Insight — Signup Free Credit Setting
-- =============================================================================
-- Super admin can configure the initial credit granted to the first corporate
-- admin when a new company workspace is created.

create table if not exists public.platform_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  description text,
  updated_at timestamptz default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.platform_settings enable row level security;

drop policy if exists "platform_settings_super_read" on public.platform_settings;
create policy "platform_settings_super_read" on public.platform_settings
  for select using (public.is_super_admin(auth.uid()));

drop policy if exists "platform_settings_super_insert" on public.platform_settings;
create policy "platform_settings_super_insert" on public.platform_settings
  for insert with check (public.is_super_admin(auth.uid()));

drop policy if exists "platform_settings_super_update" on public.platform_settings;
create policy "platform_settings_super_update" on public.platform_settings
  for update using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

drop trigger if exists trg_platform_settings_updated on public.platform_settings;
create trigger trg_platform_settings_updated
  before update on public.platform_settings
  for each row execute function public.set_updated_at();

insert into public.platform_settings (key, value, description)
values (
  'signup_free_credits',
  jsonb_build_object('enabled', true, 'credits', 30),
  'Free credits granted to a new corporate workspace during first registration.'
)
on conflict (key) do nothing;

create or replace function public.get_signup_free_credits()
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (
      select case
        when coalesce((value->>'enabled')::boolean, true) = false then 0
        else greatest(coalesce((value->>'credits')::integer, 30), 0)
      end
      from public.platform_settings
      where key = 'signup_free_credits'
    ),
    30
  )
$$;

revoke all on function public.get_signup_free_credits() from public;
grant execute on function public.get_signup_free_credits() to authenticated;

create or replace function public.create_user_workspace(workspace_name text)
returns public.users
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  current_email text;
  normalized_workspace_name text := nullif(btrim(workspace_name), '');
  new_organization_id uuid;
  signup_credits integer := 0;
  profile public.users;
begin
  if current_user_id is null then
    raise exception 'User belum login.'
      using errcode = '28000';
  end if;

  select *
    into profile
    from public.users
   where id = current_user_id;

  if found then
    return profile;
  end if;

  if normalized_workspace_name is null then
    raise exception 'Nama organisasi wajib diisi.'
      using errcode = '22023';
  end if;

  select email
    into current_email
    from auth.users
   where id = current_user_id;

  signup_credits := public.get_signup_free_credits();

  insert into public.organizations (name)
  values (normalized_workspace_name)
  returning id into new_organization_id;

  insert into public.users (id, organization_id, role, email, full_name, credit_balance)
  values (
    current_user_id,
    new_organization_id,
    'corporate_admin',
    current_email,
    nullif(split_part(coalesce(current_email, ''), '@', 1), ''),
    signup_credits
  )
  returning * into profile;

  if signup_credits > 0 then
    insert into public.credit_transactions (
      organization_id,
      user_id,
      type,
      amount,
      payment_provider,
      payment_status,
      notes
    )
    values (
      new_organization_id,
      current_user_id,
      'adjust',
      signup_credits,
      'system',
      'completed',
      'Signup free credit'
    );
  end if;

  return profile;
end;
$$;

revoke all on function public.create_user_workspace(text) from public;
grant execute on function public.create_user_workspace(text) to authenticated;
