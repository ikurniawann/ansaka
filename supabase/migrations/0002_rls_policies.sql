-- =============================================================================
-- ANSAKA OAM Insight — Row Level Security Policies (Migration 0002)
-- =============================================================================
-- Rules (per System Blueprint §2.3):
--   - Corporate Admin: only sees data from their own organization
--   - Respondent: no auth, accesses survey via unique_link_token only
--   - Super Admin: full access via service role (bypasses RLS) or role check
--   - Individual data anonymized; dashboard shows aggregate only

-- =============================================================================
-- HELPER: is_super_admin(uid)
-- =============================================================================
create or replace function public.is_super_admin(uid uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.users
     where id = uid and role = 'super_admin'
  );
$$;

create or replace function public.user_org(uid uuid)
returns uuid language sql security definer stable as $$
  select organization_id from public.users where id = uid;
$$;

-- =============================================================================
-- ORGANIZATIONS
-- =============================================================================
alter table public.organizations enable row level security;

drop policy if exists "org_select_own" on public.organizations;
create policy "org_select_own" on public.organizations
  for select using (
    public.is_super_admin(auth.uid())
    or id = public.user_org(auth.uid())
  );

drop policy if exists "org_insert_self" on public.organizations;
create policy "org_insert_self" on public.organizations
  for insert with check (auth.uid() is not null);

drop policy if exists "org_update_own" on public.organizations;
create policy "org_update_own" on public.organizations
  for update using (
    public.is_super_admin(auth.uid())
    or id = public.user_org(auth.uid())
  );

-- =============================================================================
-- USERS
-- =============================================================================
alter table public.users enable row level security;

drop policy if exists "users_select_self_or_admin" on public.users;
create policy "users_select_self_or_admin" on public.users
  for select using (
    public.is_super_admin(auth.uid())
    or id = auth.uid()
    or organization_id = public.user_org(auth.uid())
  );

drop policy if exists "users_insert_self" on public.users;
create policy "users_insert_self" on public.users
  for insert with check (id = auth.uid());

drop policy if exists "users_update_self_or_admin" on public.users;
create policy "users_update_self_or_admin" on public.users
  for update using (
    public.is_super_admin(auth.uid())
    or id = auth.uid()
  );

-- =============================================================================
-- DIVISIONS
-- =============================================================================
alter table public.divisions enable row level security;

drop policy if exists "divisions_org_only" on public.divisions;
create policy "divisions_org_only" on public.divisions
  for all using (
    public.is_super_admin(auth.uid())
    or organization_id = public.user_org(auth.uid())
  );

-- =============================================================================
-- SURVEY_BATCHES
-- =============================================================================
alter table public.survey_batches enable row level security;

drop policy if exists "batches_org_only" on public.survey_batches;
create policy "batches_org_only" on public.survey_batches
  for all using (
    public.is_super_admin(auth.uid())
    or organization_id = public.user_org(auth.uid())
  );

-- Anonymous SELECT for survey form: only check if token is active.
-- Use a view-style function that returns minimal data.
drop policy if exists "batches_anon_token_select" on public.survey_batches;
create policy "batches_anon_token_select" on public.survey_batches
  for select using (status = 'active');

-- =============================================================================
-- SURVEY_RESPONSES
-- =============================================================================
alter table public.survey_responses enable row level security;

-- Anonymous INSERT (respondents). The batch token check happens
-- in the application layer (validate token → batch_id → insert).
drop policy if exists "responses_anon_insert" on public.survey_responses;
create policy "responses_anon_insert" on public.survey_responses
  for insert with check (
    exists (
      select 1 from public.survey_batches
       where id = batch_id and status = 'active'
         and credits_used < credits_allocated
    )
  );

-- Aggregate visibility: only super admin can read raw individual rows.
-- Corporate Admin reads via batch_results (aggregate only).
drop policy if exists "responses_super_only" on public.survey_responses;
create policy "responses_super_only" on public.survey_responses
  for select using (public.is_super_admin(auth.uid()));

-- =============================================================================
-- BATCH_RESULTS — aggregate, viewable by org owner
-- =============================================================================
alter table public.batch_results enable row level security;

drop policy if exists "batch_results_org_view" on public.batch_results;
create policy "batch_results_org_view" on public.batch_results
  for select using (
    public.is_super_admin(auth.uid())
    or exists (
      select 1 from public.survey_batches sb
       where sb.id = batch_id
         and sb.organization_id = public.user_org(auth.uid())
    )
  );

drop policy if exists "batch_results_super_write" on public.batch_results;
create policy "batch_results_super_write" on public.batch_results
  for all using (public.is_super_admin(auth.uid()));

-- =============================================================================
-- CREDIT_PACKAGES — readable by everyone, writable by super admin only
-- =============================================================================
alter table public.credit_packages enable row level security;

drop policy if exists "packages_public_read" on public.credit_packages;
create policy "packages_public_read" on public.credit_packages
  for select using (is_active = true or public.is_super_admin(auth.uid()));

drop policy if exists "packages_super_write" on public.credit_packages;
create policy "packages_super_write" on public.credit_packages
  for all using (public.is_super_admin(auth.uid()));

-- =============================================================================
-- CREDIT_TRANSACTIONS
-- =============================================================================
alter table public.credit_transactions enable row level security;

drop policy if exists "credit_tx_org_view" on public.credit_transactions;
create policy "credit_tx_org_view" on public.credit_transactions
  for select using (
    public.is_super_admin(auth.uid())
    or organization_id = public.user_org(auth.uid())
  );

drop policy if exists "credit_tx_org_insert" on public.credit_transactions;
create policy "credit_tx_org_insert" on public.credit_transactions
  for insert with check (
    public.is_super_admin(auth.uid())
    or organization_id = public.user_org(auth.uid())
  );
