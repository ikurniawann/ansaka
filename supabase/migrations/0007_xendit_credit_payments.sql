-- =============================================================================
-- ANSAKA OAM Insight — Xendit credit purchase metadata (Migration 0007)
-- =============================================================================

alter table public.credit_transactions
  add column if not exists payment_provider text,
  add column if not exists payment_status text not null default 'completed',
  add column if not exists external_id text,
  add column if not exists provider_payment_id text,
  add column if not exists checkout_url text,
  add column if not exists paid_at timestamptz,
  add column if not exists raw_webhook jsonb;

alter table public.credit_transactions
  drop constraint if exists credit_transactions_payment_status_check;

alter table public.credit_transactions
  add constraint credit_transactions_payment_status_check
  check (payment_status in ('pending', 'paid', 'expired', 'failed', 'completed'));

create unique index if not exists idx_credit_tx_external_id
  on public.credit_transactions (external_id)
  where external_id is not null;

create index if not exists idx_credit_tx_payment_status
  on public.credit_transactions (payment_provider, payment_status, created_at desc);

-- Existing historical rows are already completed credit movements.
update public.credit_transactions
   set payment_status = 'completed'
 where payment_status is null;

create or replace function public.apply_credit_purchase(
  p_transaction_id uuid,
  p_provider_payment_id text default null,
  p_raw_webhook jsonb default '{}'::jsonb,
  p_paid_at timestamptz default now()
)
returns public.credit_transactions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tx public.credit_transactions;
begin
  select *
    into v_tx
    from public.credit_transactions
   where id = p_transaction_id
   for update;

  if not found then
    raise exception 'Transaksi tidak ditemukan.' using errcode = 'P0002';
  end if;

  if v_tx.payment_status = 'paid' then
    return v_tx;
  end if;

  if v_tx.type <> 'purchase' or v_tx.amount <= 0 then
    raise exception 'Transaksi bukan pembelian kredit valid.' using errcode = '23514';
  end if;

  update public.users
     set credit_balance = credit_balance + v_tx.amount
   where organization_id = v_tx.organization_id
     and role = 'corporate_admin';

  update public.credit_transactions
     set payment_status = 'paid',
         provider_payment_id = coalesce(p_provider_payment_id, provider_payment_id),
         paid_at = coalesce(p_paid_at, now()),
         raw_webhook = p_raw_webhook,
         notes = coalesce(notes, 'Xendit invoice paid')
   where id = p_transaction_id
  returning * into v_tx;

  return v_tx;
end;
$$;

revoke all on function public.apply_credit_purchase(uuid, text, jsonb, timestamptz) from public;
grant execute on function public.apply_credit_purchase(uuid, text, jsonb, timestamptz) to service_role;
