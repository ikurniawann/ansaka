-- =============================================================================
-- ANSAKA OAM Insight — Seed Data (Migration 0004)
-- =============================================================================
-- Default credit packages, default pricing tier, default OAM formula,
-- default CMS pages.

-- =============================================================================
-- DEFAULT CREDIT PACKAGES
-- =============================================================================
insert into public.credit_packages (name, credits, price_idr, description, sort_order)
values
  ('Starter',    20,  2000000, 'Tim kecil, pilot assessment',     1),
  ('Growth',     50,  4500000, 'Departemen menengah',             2),
  ('Business',  100,  8500000, 'Perusahaan menengah',             3),
  ('Enterprise', 500, 35000000, 'Korporasi besar / multi-divisi', 4)
on conflict do nothing;

-- =============================================================================
-- DEFAULT PRICING TIER (free 30 + paid above)
-- =============================================================================
insert into public.pricing_tiers (name, description, min_links_inclusive, max_links_inclusive, price_per_link_idr, sort_order)
values
  ('Free Tier',     'Gratis untuk 30 link survei pertama',                  0,  30, 0,       1),
  ('Standard Tier', 'Berbayar per link untuk lebih dari 30 link',          31, null, 100000,  2)
on conflict do nothing;

-- =============================================================================
-- DEFAULT OAM FORMULA — same as code default (oam12-v1)
-- The application will use the in-code WEIGHT_MAP if no active formula exists,
-- or the active row's weight_map if present.
-- This row uses a copy of the locked default for traceability.
-- =============================================================================
insert into public.oam_formulas (version, description, weight_map, status_thresholds, is_active, notes)
values (
  'oam12-v1',
  'Default locked OAM formula per System Blueprint v1.0',
  '{
    "D1":  {"Q1": {"FP1": 0.7, "FP2": 0.3}, "Q2": {"FP2": 0.7, "FP5": 0.3}, "Q3": {"FP2": 0.2, "FP3": 0.7, "FP5": 0.1}, "Q4": {"FP4": 0.7, "FP5": 0.3}, "Q5": {"FP2": 0.2, "FP5": 0.8}, "Q6": {"FP1": 0.2, "FP2": 0.3, "FP3": 0.2, "FP4": 0.3}},
    "D2":  {"Q1": {"FP12": 0.3}, "Q2": {"FP12": 0.3}, "Q3": {"FP12": 0.2}, "Q4": {"FP12": 0.2}},
    "D3":  {"Q1": {"FP6": 0.7, "FP7": 0.3}, "Q2": {"FP6": 0.8, "FP7": 0.2}, "Q3": {"FP6": 0.2, "FP7": 0.8}, "Q4": {"FP6": 0.3, "FP7": 0.7}},
    "D4":  {"Q1": {"FP8": 0.25}, "Q2": {"FP8": 0.3}, "Q3": {"FP8": 0.25}, "Q4": {"FP8": 0.2}},
    "D5":  {"Q1": {"FP9": 0.8, "FP10": 0.2}, "Q2": {"FP9": 0.7, "FP20": 0.3}, "Q3": {"FP10": 0.8, "FP20": 0.2}, "Q4": {"FP10": 0.8, "FP20": 0.2}, "Q5": {"FP10": 0.2, "FP20": 0.8}, "Q6": {"FP9": 0.3, "FP20": 0.7}},
    "D6":  {"Q1": {"FP13": 0.7, "FP14": 0.3}, "Q2": {"FP13": 0.8, "FP14": 0.2}, "Q3": {"FP15": 0.8, "FP14": 0.2}, "Q4": {"FP15": 0.8, "FP14": 0.2}, "Q5": {"FP14": 1.0}, "Q6": {"FP13": 0.2, "FP15": 0.3, "FP14": 0.5}},
    "D7":  {"Q1": {"FP21": 0.7, "FP11": 0.3}, "Q2": {"FP21": 0.8, "FP11": 0.2}, "Q3": {"FP21": 0.3, "FP11": 0.7}, "Q4": {"FP21": 0.2, "FP11": 0.8}, "Q5": {"FP21": 0.7, "FP11": 0.3}},
    "D8":  {"Q1": {"FP17": 0.3}, "Q2": {"FP17": 0.25}, "Q3": {"FP17": 0.2}, "Q4": {"FP17": 0.25}},
    "D9":  {"Q1": {"FP16": 0.8, "FP18": 0.2}, "Q2": {"FP18": 0.8, "FP19": 0.2}, "Q3": {"FP16": 0.2, "FP18": 0.8}, "Q4": {"FP18": 0.2, "FP19": 0.8}, "Q5": {"FP16": 0.2, "FP19": 0.8}},
    "D10": {"Q1": {"FP22": 0.8, "FP23": 0.2}, "Q2": {"FP22": 0.8, "FP23": 0.2}, "Q3": {"FP22": 0.2, "FP23": 0.8}, "Q4": {"FP22": 0.2, "FP23": 0.8}, "Q5": {"FP22": 0.7, "FP23": 0.3}},
    "D11": {"Q1": {"FP24": 0.6, "FP25": 0.4}, "Q2": {"FP24": 0.8, "FP25": 0.2}, "Q3": {"FP24": 0.8, "FP25": 0.2}, "Q4": {"FP24": 0.2, "FP25": 0.8}, "Q5": {"FP24": 0.3, "FP25": 0.7}},
    "D12": {"Q1": {"FP26": 0.8, "FP27": 0.2}, "Q2": {"FP26": 0.7, "FP27": 0.3}, "Q3": {"FP26": 0.3, "FP27": 0.7}, "Q4": {"FP26": 0.2, "FP27": 0.8}, "Q5": {"FP26": 0.2, "FP27": 0.8}}
  }'::jsonb,
  '[
    {"min": 1.0, "max": 2.0, "level": "Critical", "key": "critical"},
    {"min": 2.0, "max": 2.8, "level": "Weak",     "key": "weak"},
    {"min": 2.8, "max": 3.5, "level": "Stable",   "key": "stable"},
    {"min": 3.5, "max": 4.01, "level": "Strong",  "key": "strong"}
  ]'::jsonb,
  true,
  'Initial seed; matches in-code WEIGHT_MAP'
)
on conflict (version) do nothing;

-- =============================================================================
-- DEFAULT CMS PAGES (skeleton)
-- =============================================================================
insert into public.cms_pages (slug, title_id, title_en, content_id, content_en, is_published)
values
  ('home',     'Beranda',         'Home',         '{"sections":[]}'::jsonb, '{"sections":[]}'::jsonb, true),
  ('services', 'Layanan',         'Services',     '{"sections":[]}'::jsonb, '{"sections":[]}'::jsonb, true),
  ('about',    'Tentang Kami',    'About Us',     '{"sections":[]}'::jsonb, '{"sections":[]}'::jsonb, true),
  ('contact',  'Hubungi Kami',    'Contact',      '{"sections":[]}'::jsonb, '{"sections":[]}'::jsonb, true)
on conflict (slug) do nothing;
