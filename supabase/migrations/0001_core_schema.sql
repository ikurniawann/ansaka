-- =============================================================================
-- ANSAKA OAM Insight — Core Schema (Migration 0001)
-- =============================================================================
-- Tech: Supabase PostgreSQL
-- All tables use UUID primary keys, RLS enabled by default.
-- Timestamps use TIMESTAMPTZ.

-- Helpful extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- =============================================================================
-- ORGANIZATIONS — corporate clients
-- =============================================================================
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  size_range text,
  country text default 'Indonesia',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_organizations_name on public.organizations (name);

-- =============================================================================
-- USERS — Corporate Admin & Super Admin (linked to auth.users)
-- =============================================================================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  role text not null check (role in ('corporate_admin', 'super_admin')),
  full_name text,
  email text,
  credit_balance integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_users_organization on public.users (organization_id);
create index if not exists idx_users_role on public.users (role);

-- =============================================================================
-- DIVISIONS — departments inside an organization (filter analytics)
-- =============================================================================
create table if not exists public.divisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  unique (organization_id, name)
);
create index if not exists idx_divisions_organization on public.divisions (organization_id);

-- =============================================================================
-- SURVEY_BATCHES — one survey campaign
-- =============================================================================
create table if not exists public.survey_batches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text,
  unique_link_token text unique not null default encode(gen_random_bytes(16), 'hex'),
  status text not null default 'draft' check (status in ('draft', 'active', 'closed')),
  credits_allocated integer not null default 0,
  credits_used integer not null default 0,
  min_respondents integer not null default 10,
  survey_version text not null default 'oam12-v1',
  created_at timestamptz default now(),
  closed_at timestamptz,
  created_by uuid references auth.users(id) on delete set null
);
create index if not exists idx_survey_batches_org on public.survey_batches (organization_id);
create index if not exists idx_survey_batches_token on public.survey_batches (unique_link_token);
create index if not exists idx_survey_batches_status on public.survey_batches (status);

-- =============================================================================
-- SURVEY_RESPONSES — anonymized respondent submissions
-- =============================================================================
create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.survey_batches(id) on delete cascade,
  division_id uuid references public.divisions(id) on delete set null,
  submission_id text unique not null default encode(gen_random_bytes(8), 'hex'),
  raw_answers jsonb not null,           -- { "D1": { "Q1": 3, "Q2": 0, ... }, ... }
  open_ended jsonb,                      -- { "D1": "...", "D2": "...", ... }
  fp_scores jsonb,                       -- { "FP1": 2.78, ... }
  driver_scores jsonb,                   -- { "D1": 2.84, ... }
  layer_scores jsonb,                    -- { "strategic_foundation": 2.91, ... }
  gap_scores jsonb,                      -- { "strategic_clarity": 2.84, ... }
  app_version text default '1.0.0',
  survey_version text default 'oam12-v1',
  response_status text default 'complete' check (response_status in ('complete', 'partial')),
  submitted_at timestamptz default now()
);
create index if not exists idx_responses_batch on public.survey_responses (batch_id);
create index if not exists idx_responses_division on public.survey_responses (division_id);
create index if not exists idx_responses_submitted on public.survey_responses (submitted_at desc);

-- =============================================================================
-- BATCH_RESULTS — aggregate per batch (computed from survey_responses)
-- =============================================================================
create table if not exists public.batch_results (
  batch_id uuid primary key references public.survey_batches(id) on delete cascade,
  driver_scores jsonb not null,
  fp_scores jsonb not null,
  layer_scores jsonb not null,
  gap_scores jsonb not null,
  overall_score numeric(3, 2),
  maturity_level text,
  respondent_count integer not null default 0,
  computed_at timestamptz default now()
);

-- =============================================================================
-- CREDIT_PACKAGES — purchasable bundles (managed by Super Admin)
-- =============================================================================
create table if not exists public.credit_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  credits integer not null,
  price_idr integer not null,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);
create index if not exists idx_credit_packages_active on public.credit_packages (is_active, sort_order);

-- =============================================================================
-- CREDIT_TRANSACTIONS — log every credit movement
-- =============================================================================
create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  type text not null check (type in ('purchase', 'allocate', 'consume', 'refund', 'adjust')),
  amount integer not null,                  -- + for credit, - for debit
  batch_id uuid references public.survey_batches(id) on delete set null,
  package_id uuid references public.credit_packages(id) on delete set null,
  payment_ref text,
  notes text,
  created_at timestamptz default now()
);
create index if not exists idx_credit_tx_org on public.credit_transactions (organization_id, created_at desc);
create index if not exists idx_credit_tx_batch on public.credit_transactions (batch_id);

-- =============================================================================
-- AUTO-UPDATE updated_at trigger
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_organizations_updated on public.organizations;
create trigger trg_organizations_updated
  before update on public.organizations
  for each row execute function public.set_updated_at();

drop trigger if exists trg_users_updated on public.users;
create trigger trg_users_updated
  before update on public.users
  for each row execute function public.set_updated_at();

-- =============================================================================
-- HELPER: deduct credit on response insert
-- =============================================================================
create or replace function public.consume_credit_on_response()
returns trigger language plpgsql security definer as $$
begin
  -- Only deduct when response is complete
  if new.response_status = 'complete' then
    update public.survey_batches
       set credits_used = credits_used + 1
     where id = new.batch_id
       and credits_used < credits_allocated;

    insert into public.credit_transactions (organization_id, type, amount, batch_id, notes)
    select organization_id, 'consume', -1, id, 'Auto-deducted on response submission'
      from public.survey_batches
     where id = new.batch_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_consume_credit_on_response on public.survey_responses;
create trigger trg_consume_credit_on_response
  after insert on public.survey_responses
  for each row execute function public.consume_credit_on_response();
