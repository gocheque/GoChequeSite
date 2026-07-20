-- =============================================================================
-- eCheck.ca — Schéma minimal : tokens uniquement
-- Auth = Supabase auth.users (automatique, rien à sauvegarder côté app)
-- Exécutez CE FICHIER SEUL dans Supabase > SQL Editor > Run
-- =============================================================================

-- ─── Nettoyage (anciennes tables si présentes) ───────────────────────────────
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.cheques cascade;
drop table if exists public.token_transactions cascade;
drop table if exists public.profiles cascade;

-- ─── Tokens (1 jeton = 1 ligne) ──────────────────────────────────────────────
create table if not exists public.tokens (
  id uuid primary key default gen_random_uuid(),
  code text unique not null default ('ec_' || replace(gen_random_uuid()::text, '-', '')),
  created_at timestamptz not null default now(),
  owner_type text not null check (owner_type in ('user', 'guest')),
  owner_user_id uuid references auth.users(id) on delete set null,
  owner_guest_id text,
  is_used boolean not null default false,
  used_at timestamptz,
  used_by_user_id uuid references auth.users(id) on delete set null,
  used_by_guest_id text,
  package_id text,
  description text,
  constraint tokens_owner_user check (
    owner_type <> 'user' or owner_user_id is not null
  ),
  constraint tokens_owner_guest check (
    owner_type <> 'guest' or owner_guest_id is not null
  )
);

create index if not exists tokens_owner_user_idx
  on public.tokens (owner_user_id)
  where owner_type = 'user' and not is_used;

create index if not exists tokens_owner_guest_idx
  on public.tokens (owner_guest_id)
  where owner_type = 'guest' and not is_used;

-- ─── RPC : acheter → crée N jetons (user ou guest), retourne les clés ────────
create or replace function public.purchase_tokens(
  p_tokens integer,
  p_package_id text,
  p_description text,
  p_user_id uuid default null,
  p_guest_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  i integer;
  new_balance integer;
  v_owner_type text;
  inserted_row public.tokens%rowtype;
  result_keys jsonb := '[]'::jsonb;
begin
  if p_tokens < 1 then
    raise exception 'INVALID_TOKEN_COUNT';
  end if;

  if p_user_id is not null then
    v_owner_type := 'user';
  elsif p_guest_id is not null and length(trim(p_guest_id)) > 0 then
    v_owner_type := 'guest';
  else
    raise exception 'OWNER_REQUIRED';
  end if;

  for i in 1..p_tokens loop
    insert into public.tokens (
      owner_type,
      owner_user_id,
      owner_guest_id,
      package_id,
      description
    ) values (
      v_owner_type,
      case when v_owner_type = 'user' then p_user_id else null end,
      case when v_owner_type = 'guest' then p_guest_id else null end,
      p_package_id,
      p_description
    )
    returning * into inserted_row;

    result_keys := result_keys || jsonb_build_object(
      'id', inserted_row.id,
      'code', inserted_row.code,
      'created_at', inserted_row.created_at
    );
  end loop;

  if v_owner_type = 'user' then
    select count(*)::integer into new_balance
    from public.tokens
    where owner_type = 'user'
      and owner_user_id = p_user_id
      and not is_used;
  else
    select count(*)::integer into new_balance
    from public.tokens
    where owner_type = 'guest'
      and owner_guest_id = p_guest_id
      and not is_used;
  end if;

  return jsonb_build_object('balance', new_balance, 'keys', result_keys);
end;
$$;

-- ─── RPC : consommer → marque 1 jeton comme utilisé (user ou guest) ──────────
create or replace function public.consume_token(
  p_description text default 'Traitement et impression d''un chèque',
  p_user_id uuid default null,
  p_guest_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  token_id uuid;
  token_code text;
  new_balance integer;
  v_owner_type text;
begin
  if p_user_id is not null then
    v_owner_type := 'user';
    select id, code into token_id, token_code
    from public.tokens
    where owner_type = 'user'
      and owner_user_id = p_user_id
      and not is_used
    order by created_at asc
    limit 1
    for update skip locked;
  elsif p_guest_id is not null and length(trim(p_guest_id)) > 0 then
    v_owner_type := 'guest';
    select id, code into token_id, token_code
    from public.tokens
    where owner_type = 'guest'
      and owner_guest_id = p_guest_id
      and not is_used
    order by created_at asc
    limit 1
    for update skip locked;
  else
    raise exception 'OWNER_REQUIRED';
  end if;

  if token_id is null then
    raise exception 'INSUFFICIENT_TOKENS';
  end if;

  if v_owner_type = 'user' then
    update public.tokens
    set is_used = true,
        used_at = now(),
        used_by_user_id = p_user_id,
        description = coalesce(description, p_description)
    where id = token_id;

    select count(*)::integer into new_balance
    from public.tokens
    where owner_type = 'user'
      and owner_user_id = p_user_id
      and not is_used;
  else
    update public.tokens
    set is_used = true,
        used_at = now(),
        used_by_guest_id = p_guest_id,
        description = coalesce(description, p_description)
    where id = token_id;

    select count(*)::integer into new_balance
    from public.tokens
    where owner_type = 'guest'
      and owner_guest_id = p_guest_id
      and not is_used;
  end if;

  return jsonb_build_object(
    'balance', new_balance,
    'consumed', jsonb_build_object('id', token_id, 'code', token_code)
  );
end;
$$;

-- ─── Row Level Security ────────────────────────────────────────────────────────
alter table public.tokens enable row level security;

drop policy if exists "tokens_select_own" on public.tokens;
create policy "tokens_select_own"
  on public.tokens for select
  using (
    (owner_type = 'user' and auth.uid() = owner_user_id)
    or (used_by_user_id is not null and auth.uid() = used_by_user_id)
  );
