-- =============================================================================
-- OBSOLÈTE — Utilisez plutôt 002_tokens_table.sql (tokens uniquement)
-- =============================================================================

-- ─── Profiles (lié à auth.users) ─────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  token_balance integer not null default 0 check (token_balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Historique des jetons ───────────────────────────────────────────────────
create table if not exists public.token_transactions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null,
  type text not null check (type in ('PURCHASE', 'CONSUMPTION', 'BONUS')),
  package_id text,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists token_transactions_profile_id_idx
  on public.token_transactions(profile_id);

-- ─── Chèques ───────────────────────────────────────────────────────────────────
create table if not exists public.cheques (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  cheque_number text not null,
  payee text not null,
  amount numeric(12, 2) not null,
  date timestamptz not null,
  transit text not null,
  institution text not null,
  account_number text not null,
  memo text,
  storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cheques_profile_id_idx on public.cheques(profile_id);

-- ─── Auto-création du profil à l'inscription ─────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── RPC : acheter des jetons (appelé côté serveur) ──────────────────────────
create or replace function public.purchase_tokens(
  p_user_id uuid,
  p_tokens integer,
  p_package_id text,
  p_description text
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_balance integer;
begin
  insert into public.profiles (id, token_balance)
  values (p_user_id, p_tokens)
  on conflict (id) do update
    set token_balance = profiles.token_balance + p_tokens,
        updated_at = now()
  returning token_balance into new_balance;

  insert into public.token_transactions (profile_id, amount, type, package_id, description)
  values (p_user_id, p_tokens, 'PURCHASE', p_package_id, p_description);

  return new_balance;
end;
$$;

-- ─── RPC : consommer 1 jeton ─────────────────────────────────────────────────
create or replace function public.consume_token(
  p_user_id uuid,
  p_description text default 'Traitement et impression d''un chèque'
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_balance integer;
begin
  update public.profiles
  set token_balance = token_balance - 1,
      updated_at = now()
  where id = p_user_id and token_balance >= 1
  returning token_balance into new_balance;

  if not found then
    raise exception 'INSUFFICIENT_TOKENS';
  end if;

  insert into public.token_transactions (profile_id, amount, type, description)
  values (p_user_id, -1, 'CONSUMPTION', p_description);

  return new_balance;
end;
$$;

-- ─── Row Level Security ────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.token_transactions enable row level security;
alter table public.cheques enable row level security;

-- Profiles : lecture de son propre profil
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Transactions : lecture de ses propres transactions
create policy "token_transactions_select_own"
  on public.token_transactions for select
  using (auth.uid() = profile_id);

-- Chèques : CRUD sur ses propres chèques
create policy "cheques_select_own"
  on public.cheques for select
  using (auth.uid() = profile_id);

create policy "cheques_insert_own"
  on public.cheques for insert
  with check (auth.uid() = profile_id);

create policy "cheques_update_own"
  on public.cheques for update
  using (auth.uid() = profile_id);

create policy "cheques_delete_own"
  on public.cheques for delete
  using (auth.uid() = profile_id);

-- ─── Storage : bucket pour PDFs de chèques ─────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cheques',
  'cheques',
  false,
  5242880,
  array['application/pdf']
)
on conflict (id) do nothing;

-- Chaque utilisateur accède à son dossier : cheques/{user_id}/...
create policy "cheques_storage_select_own"
  on storage.objects for select
  using (
    bucket_id = 'cheques'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "cheques_storage_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'cheques'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "cheques_storage_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'cheques'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
