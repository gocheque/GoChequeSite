-- =============================================================================
-- eCheck.ca — Mise à jour : achat guest/user + retour des clés
-- Exécutez si vous avez déjà lancé une version antérieure de 002_tokens_table.sql
-- =============================================================================

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
