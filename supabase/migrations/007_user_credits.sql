-- =============================================================================
-- GoCheque — Solde de crédits par utilisateur (Option A)
-- Remplace le modèle « 1 ligne = 1 jeton » par un solde + journal.
-- =============================================================================

create table if not exists public.user_credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  delta integer not null check (delta <> 0),
  balance_after integer not null check (balance_after >= 0),
  reason text not null check (reason in ('purchase', 'consume', 'migration', 'adjustment')),
  package_id text,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists credit_transactions_user_created_idx
  on public.credit_transactions (user_id, created_at desc);

alter table public.user_credits enable row level security;
alter table public.credit_transactions enable row level security;

-- ─── Migration des jetons utilisateur non utilisés ───────────────────────────
-- (sans filtre expires_at : cette colonne peut être absente si la migration 005
--  n'a pas été appliquée ; avec l'option A, l'expiration n'est plus utilisée)
insert into public.user_credits (user_id, balance)
select owner_user_id, count(*)::integer
from public.tokens
where owner_type = 'user'
  and owner_user_id is not null
  and not is_used
group by owner_user_id
on conflict (user_id) do update
  set balance = excluded.balance,
      updated_at = now();

insert into public.credit_transactions (user_id, delta, balance_after, reason, description)
select uc.user_id, uc.balance, uc.balance, 'migration',
       'Migration depuis l''ancien système de jetons'
from public.user_credits uc
where uc.balance > 0
  and not exists (
    select 1
    from public.credit_transactions ct
    where ct.user_id = uc.user_id
      and ct.reason = 'migration'
  );

-- ─── RPC : acheter des crédits ───────────────────────────────────────────────
create or replace function public.purchase_credits(
  p_user_id uuid,
  p_amount integer,
  p_package_id text,
  p_description text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  new_balance integer;
begin
  if p_amount < 1 then
    raise exception 'INVALID_AMOUNT';
  end if;

  if p_user_id is null then
    raise exception 'USER_REQUIRED';
  end if;

  insert into public.user_credits (user_id, balance)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  update public.user_credits
  set balance = balance + p_amount,
      updated_at = now()
  where user_id = p_user_id
  returning balance into new_balance;

  insert into public.credit_transactions (
    user_id,
    delta,
    balance_after,
    reason,
    package_id,
    description
  ) values (
    p_user_id,
    p_amount,
    new_balance,
    'purchase',
    p_package_id,
    coalesce(p_description, 'Achat de crédits')
  );

  return jsonb_build_object(
    'balance', new_balance,
    'credits_added', p_amount
  );
end;
$$;

-- ─── RPC : consommer des crédits ─────────────────────────────────────────────
create or replace function public.consume_credit(
  p_user_id uuid,
  p_amount integer default 1,
  p_description text default 'Impression d''un chèque'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_balance integer;
  new_balance integer;
begin
  if p_amount < 1 then
    raise exception 'INVALID_AMOUNT';
  end if;

  if p_user_id is null then
    raise exception 'USER_REQUIRED';
  end if;

  insert into public.user_credits (user_id, balance)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  select balance into current_balance
  from public.user_credits
  where user_id = p_user_id
  for update;

  if current_balance < p_amount then
    raise exception 'INSUFFICIENT_CREDITS';
  end if;

  update public.user_credits
  set balance = balance - p_amount,
      updated_at = now()
  where user_id = p_user_id
  returning balance into new_balance;

  insert into public.credit_transactions (
    user_id,
    delta,
    balance_after,
    reason,
    description
  ) values (
    p_user_id,
    -p_amount,
    new_balance,
    'consume',
    p_description
  );

  return jsonb_build_object(
    'balance', new_balance,
    'consumed', p_amount
  );
end;
$$;
