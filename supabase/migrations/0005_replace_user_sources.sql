-- Substitui a seleção do usuário em uma única transação (atômico).
-- security invoker: roda como o chamador, então a RLS de user_sources se aplica
-- (delete/insert só nas próprias linhas). Forçamos user_id = auth.uid().
create function replace_user_sources(item_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  delete from public.user_sources where user_id = auth.uid();
  if array_length(item_ids, 1) is not null then
    insert into public.user_sources (user_id, source_item_id)
    select auth.uid(), unnest(item_ids);
  end if;
end;
$$;

grant execute on function replace_user_sources(uuid[]) to authenticated;
