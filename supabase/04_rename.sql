-- Hanh's Family Tree — rename a tree (Entry 138)
-- Run once in Supabase → SQL Editor after 03_review.sql. Safe to run again.
--
-- rename_tree — the tree's editor (or an admin) changes the tree's name. The link name (?tree=…) stays the same.
--               Each rename goes on Hanh's review list as kind 'rename' (an admin's own rename is confirmed straight away).

create or replace function public.rename_tree(p_code text, p_link text, p_name text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare e uuid; adm boolean; t trees; n text := btrim(coalesce(p_name, ''));
begin
  e := _editor_for(p_code);
  if e is null then return jsonb_build_object('ok', false, 'why', 'code'); end if;
  if n = '' or length(n) > 60 then return jsonb_build_object('ok', false, 'why', 'name'); end if;
  select is_admin into adm from editors where id = e;
  select * into t from trees where link = p_link or p_link = any(old_links) for update;
  if not found then return jsonb_build_object('ok', false, 'why', 'no tree'); end if;
  if t.editor is distinct from e and not adm then return jsonb_build_object('ok', false, 'why', 'not your tree'); end if;
  if t.name is not distinct from n then return jsonb_build_object('ok', true, 'name', n); end if;
  update trees set name = n, updated_at = now() where id = t.id;
  insert into changes (editor, tree, kind, before, after, confirmed_at, confirmed_by)
  values (e, t.id, 'rename', jsonb_build_object('name', t.name), jsonb_build_object('name', n),
          case when adm then now() end, case when adm then (select name from editors where id = e) end);
  return jsonb_build_object('ok', true, 'name', n);
end $$;

grant execute on function public.rename_tree(text, text, text) to anon, authenticated;

select 'ready' as rename_step, (select coalesce(name, 'Unnamed tree') from trees where link = 'thuong') as minh_tree_now;
