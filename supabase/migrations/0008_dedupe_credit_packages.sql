-- =============================================================================
-- ANSAKA OAM Insight — De-duplicate credit packages (Migration 0008)
-- =============================================================================
-- Earlier seed data could be inserted more than once because credit_packages did
-- not have a natural unique constraint. Keep the oldest package row per name and
-- prevent future duplicate active package names.

with ranked as (
  select
    id,
    row_number() over (
      partition by name
      order by created_at asc, id asc
    ) as rn
  from public.credit_packages
)
delete from public.credit_packages cp
using ranked r
where cp.id = r.id
  and r.rn > 1;

create unique index if not exists idx_credit_packages_unique_name
  on public.credit_packages (name);
