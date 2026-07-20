-- =============================================================================
-- eCheck.ca — Utiliser une clé existante par son code
-- =============================================================================

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
  limit 1
  for update skip locked;

  if token_id is null then
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
