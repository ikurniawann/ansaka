-- =============================================================================
-- ANSAKA OAM Insight — Extra Features (Migration 0003)
-- =============================================================================
-- Adds:
--   1. pricing_tiers      — flexible pricing schemes (e.g., 30 free + paid)
--   2. oam_formulas       — adjustable Q→FP weights (admin-editable)
--   3. cms_pages          — content management for marketing site
--   4. cms_blog_posts     — Business Insight blog
--   5. industry_benchmarks — comparison line for dashboards

-- =============================================================================
-- 1. PRICING_TIERS — flexible pricing schemes
-- =============================================================================
create table if not exists public.pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  name text not null,                           -- "Free Tier", "Standard", etc.
  description text,
  -- Tier rule: links 1..min_links_inclusive are free.
  -- Above min_links_inclusive, price_per_link_idr applies.
  min_links_inclusive integer not null default 0,    -- e.g. 30
  max_links_inclusive integer,                       -- nullable = unlimited
  price_per_link_idr integer not null default 0,
  -- For the case "30 free, then paid": create a row with min=0, max=30, price=0,
  -- and another with min=31, max=null, price=N.
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_pricing_tiers_active on public.pricing_tiers (is_active, sort_order);

alter table public.pricing_tiers enable row level security;

drop policy if exists "pricing_tiers_public_read" on public.pricing_tiers;
create policy "pricing_tiers_public_read" on public.pricing_tiers
  for select using (is_active = true or public.is_super_admin(auth.uid()));

drop policy if exists "pricing_tiers_super_write" on public.pricing_tiers;
create policy "pricing_tiers_super_write" on public.pricing_tiers
  for all using (public.is_super_admin(auth.uid()));

-- =============================================================================
-- 2. OAM_FORMULAS — adjustable Q → FP weights
-- =============================================================================
-- Allows Super Admin to override the default WEIGHT_MAP in code.
-- Frontend reads "active" formula at survey time + scoring time.
create table if not exists public.oam_formulas (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,                  -- e.g., "oam12-v1", "oam12-v2"
  description text,
  weight_map jsonb not null,                     -- { "D1": { "Q1": { "FP1": 0.7, "FP2": 0.3 } } ... }
  fp_to_gap jsonb,                               -- override default fp→gap mapping
  status_thresholds jsonb,                       -- override default {critical, weak, stable, strong} ranges
  is_active boolean not null default false,      -- only ONE active at a time (enforced via partial unique index)
  created_at timestamptz default now(),
  created_by uuid references auth.users(id) on delete set null,
  notes text
);
create unique index if not exists ux_oam_formulas_one_active on public.oam_formulas (is_active) where is_active = true;

alter table public.oam_formulas enable row level security;

drop policy if exists "oam_formulas_public_read" on public.oam_formulas;
create policy "oam_formulas_public_read" on public.oam_formulas
  for select using (is_active = true or public.is_super_admin(auth.uid()));

drop policy if exists "oam_formulas_super_write" on public.oam_formulas;
create policy "oam_formulas_super_write" on public.oam_formulas
  for all using (public.is_super_admin(auth.uid()));

-- =============================================================================
-- 3. CMS_PAGES — content for marketing site
-- =============================================================================
create table if not exists public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                     -- 'home', 'services', 'about', 'contact'
  title_id text not null,
  title_en text not null,
  content_id jsonb,                              -- structured content for ID
  content_en jsonb,                              -- structured content for EN
  meta_description_id text,
  meta_description_en text,
  is_published boolean not null default true,
  published_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.cms_pages enable row level security;

drop policy if exists "cms_pages_public_read" on public.cms_pages;
create policy "cms_pages_public_read" on public.cms_pages
  for select using (is_published = true or public.is_super_admin(auth.uid()));

drop policy if exists "cms_pages_super_write" on public.cms_pages;
create policy "cms_pages_super_write" on public.cms_pages
  for all using (public.is_super_admin(auth.uid()));

-- =============================================================================
-- 4. CMS_BLOG_POSTS — Business Insight blog
-- =============================================================================
create table if not exists public.cms_blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_id text not null,
  title_en text,
  excerpt_id text,
  excerpt_en text,
  body_id text,                                  -- markdown
  body_en text,
  cover_image_url text,
  tags text[] default '{}',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  author_id uuid references auth.users(id) on delete set null
);
create index if not exists idx_blog_published on public.cms_blog_posts (is_published, published_at desc);
create index if not exists idx_blog_tags on public.cms_blog_posts using gin (tags);

alter table public.cms_blog_posts enable row level security;

drop policy if exists "blog_public_read_published" on public.cms_blog_posts;
create policy "blog_public_read_published" on public.cms_blog_posts
  for select using (is_published = true or public.is_super_admin(auth.uid()));

drop policy if exists "blog_super_write" on public.cms_blog_posts;
create policy "blog_super_write" on public.cms_blog_posts
  for all using (public.is_super_admin(auth.uid()));

-- =============================================================================
-- 5. INDUSTRY_BENCHMARKS — for benchmark line in dashboard
-- =============================================================================
create table if not exists public.industry_benchmarks (
  id uuid primary key default gen_random_uuid(),
  industry text not null,
  size_range text,
  driver_id text not null,                       -- 'D1', 'D2', ...
  benchmark_score numeric(3, 2) not null,
  source text,
  effective_from date default current_date,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  unique (industry, size_range, driver_id, effective_from)
);
create index if not exists idx_benchmarks_lookup on public.industry_benchmarks (industry, size_range, is_active);

alter table public.industry_benchmarks enable row level security;

drop policy if exists "benchmarks_public_read" on public.industry_benchmarks;
create policy "benchmarks_public_read" on public.industry_benchmarks
  for select using (is_active = true or public.is_super_admin(auth.uid()));

drop policy if exists "benchmarks_super_write" on public.industry_benchmarks;
create policy "benchmarks_super_write" on public.industry_benchmarks
  for all using (public.is_super_admin(auth.uid()));

-- =============================================================================
-- updated_at triggers for new tables
-- =============================================================================
drop trigger if exists trg_pricing_tiers_updated on public.pricing_tiers;
create trigger trg_pricing_tiers_updated before update on public.pricing_tiers
  for each row execute function public.set_updated_at();

drop trigger if exists trg_cms_pages_updated on public.cms_pages;
create trigger trg_cms_pages_updated before update on public.cms_pages
  for each row execute function public.set_updated_at();

drop trigger if exists trg_cms_blog_updated on public.cms_blog_posts;
create trigger trg_cms_blog_updated before update on public.cms_blog_posts
  for each row execute function public.set_updated_at();
