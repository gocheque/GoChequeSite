-- =============================================================================
-- eCheck.ca — Validité des clés : 1 an après l'achat
-- =============================================================================

alter table public.tokens
  add column if not exists expires_at timestamptz;

update public.tokens
set expires_at = created_at + interval '1 year'
where expires_at is null;

alter table public.tokens
  alter column expires_at set default (now() + interval '1 year'),
  alter column expires_at set not null;

create index if not exists tokens_expires_at_idx
  on public.tokens (expires_at)
  where not is_used;

-- ─── RPC : acheter (retourne expires_at) ─────────────────────────────────────
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
      description,
      expires_at
    ) values (
      v_owner_type,
      case when v_owner_type = 'user' then p_user_id else null end,
      case when v_owner_type = 'guest' then p_guest_id else null end,
      p_package_id,
      p_description,
      now() + interval '1 year'
    )
    returning * into inserted_row;

    result_keys := result_keys || jsonb_build_object(
      'id', inserted_row.id,
      'code', inserted_row.code,
      'created_at', inserted_row.created_at,
      'expires_at', inserted_row.expires_at
    );
  end loop;

  if v_owner_type = 'user' then
    select count(*)::integer into new_balance
    from public.tokens
    where owner_type = 'user'
      and owner_user_id = p_user_id
      and not is_used
      and expires_at > now();
  else
    select count(*)::integer into new_balance
    from public.tokens
    where owner_type = 'guest'
      and owner_guest_id = p_guest_id
      and not is_used
      and expires_at > now();
  end if;

  return jsonb_build_object('balance', new_balance, 'keys', result_keys);
end;
$$;

-- ─── RPC : consommer (ignore les clés expirées) ──────────────────────────────
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
      and expires_at > now()
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
      and expires_at > now()
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
      and not is_used
      and expires_at > now();
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
      and not is_used
      and expires_at > now();
  end if;

  return jsonb_build_object(
    'balance', new_balance,
    'consumed', jsonb_build_object('id', token_id, 'code', token_code)
  );
end;
$$;

-- ─── RPC : utiliser une clé par code (refuse si expirée) ─────────────────────
create or replace function public.redeem_token_by_code(
  p_code text,
  p_description text default 'Utilisation d''une clé existante',
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
begin
  if p_code is null or length(trim(p_code)) = 0 then
    raise exception 'INVALID_CODE';
  end if;

  select id, code into token_id, token_code
  from public.tokens
  where code = trim(p_code)
    and not is_used
    and expires_at > now()
  limit 1
  for update skip locked;

  if token_id is null then
    if exists (
      select 1
      from public.tokens
      where code = trim(p_code)
        and not is_used
        and expires_at <= now()
    ) then
      raise exception 'TOKEN_EXPIRED';
    end if;

    raise exception 'INVALID_CODE';
  end if;

  update public.tokens
  set is_used = true,
      used_at = now(),
      used_by_user_id = p_user_id,
      used_by_guest_id = p_guest_id,
      description = p_description
  where id = token_id;

  return jsonb_build_object(
    'id', token_id,
    'code', token_code
  );
end;
$$;
