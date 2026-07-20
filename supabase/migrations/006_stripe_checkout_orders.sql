-- Stripe checkout orders (fulfillment idempotency + audit trail)

create table if not exists public.stripe_checkout_orders (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text,
  user_id uuid not null,
  package_id text not null,
  amount_cents integer not null,
  tokens_count integer not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'completed', 'failed')),
  granted_keys jsonb,
  balance_after integer,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists stripe_checkout_orders_user_id_idx
  on public.stripe_checkout_orders (user_id);

create index if not exists stripe_checkout_orders_status_idx
  on public.stripe_checkout_orders (status);

alter table public.stripe_checkout_orders enable row level security;
