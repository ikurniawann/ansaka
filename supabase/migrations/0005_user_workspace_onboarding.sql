-- =============================================================================
-- ANSAKA OAM Insight — User workspace onboarding RPC (Migration 0005)
-- =============================================================================
-- Creates the first organization + public.users profile for a newly confirmed
-- Supabase Auth user. This runs as security definer so the browser client does
-- not need to insert an organization and immediately read it before a profile
-- exists.

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

  insert into public.organizations (name)
  values (normalized_workspace_name)
  returning id into new_organization_id;

  insert into public.users (id, organization_id, role, email, full_name)
  values (
    current_user_id,
    new_organization_id,
    'corporate_admin',
    current_email,
    nullif(split_part(coalesce(current_email, ''), '@', 1), '')
  )
  returning * into profile;

  return profile;
end;
$$;

revoke all on function public.create_user_workspace(text) from public;
grant execute on function public.create_user_workspace(text) to authenticated;
