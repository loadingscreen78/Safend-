-- Bootstrap function: allow first authenticated user to self-assign admin if none exists yet
create or replace function public.bootstrap_admin(_email text)
returns public.user_roles
language plpgsql
security definer
set search_path = ''
as $$
declare
  has_any_admin boolean;
  current_user_id uuid := auth.uid();
  _row public.user_roles;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select exists (
    select 1 from public.user_roles where role = 'admin'
  ) into has_any_admin;

  if has_any_admin then
    raise exception 'Admin already exists';
  end if;

  insert into public.user_roles(user_id, email, role)
  values (current_user_id, coalesce(_email, ''), 'admin')
  returning * into _row;

  return _row;
end;
$$;

revoke all on function public.bootstrap_admin(text) from public;
grant execute on function public.bootstrap_admin(text) to authenticated;