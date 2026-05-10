-- =============================================================================
-- ANSAKA OAM Insight — Landing Page Leads
-- =============================================================================
-- Captures inbound demo / book-a-call leads from the public landing page.
-- Only super admins can read the table; the public landing form writes via the
-- service-role API route (server-side), so anon insert is intentionally NOT
-- granted.

create table if not exists public.landing_leads (
  id uuid primary key default gen_random_uuid(),
  name        text        not null,
  email       text        not null,
  phone       text,
  company     text        not null,
  size        text,
  industry    text,
  message     text,
  source      text        default 'landing',
  status      text        default 'new'  check (status in ('new','contacted','qualified','dropped','converted')),
  received_at timestamptz not null default now(),
  contacted_at timestamptz,
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists landing_leads_received_at_idx
  on public.landing_leads (received_at desc);

create index if not exists landing_leads_email_idx
  on public.landing_leads (lower(email));

alter table public.landing_leads enable row level security;

drop policy if exists "landing_leads_super_read" on public.landing_leads;
create policy "landing_leads_super_read" on public.landing_leads
  for select using (public.is_super_admin(auth.uid()));

drop policy if exists "landing_leads_super_update" on public.landing_leads;
create policy "landing_leads_super_update" on public.landing_leads
  for update using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- No anon insert policy — landing form writes via server route using
-- service role, which bypasses RLS.

drop trigger if exists trg_landing_leads_updated on public.landing_leads;
create trigger trg_landing_leads_updated
  before update on public.landing_leads
  for each row execute function public.set_updated_at();
