-- Hanh's Family Tree — step 4: Hanh's review list (Entry 137)
-- Run once in Supabase → SQL Editor after 02_minh.sql. Safe to run again.
--
-- What it adds:
--   editors.is_admin  — an admin code (Hanh's) can open the review list and save any tree (so "Edit" works on Minh's).
--   check_code        — now also says whether the code is an admin's.
--   save_tree         — an admin may save any tree; everyone else only their own (as before). An admin's own changes
--                       are confirmed straight away.
--   review_list       — admin only: the changes not confirmed yet, newest first, with the editor's name and the tree.
--   confirm_changes   — admin only: marks the given changes confirmed (who / when).
-- The admin code itself is added separately (the Code Maker's SQL), never in this file.

alter table public.editors add column if not exists is_admin boolean not null default false;

create or replace function public.check_code(p_code text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare e uuid;
begin
  e := _editor_for(p_code);
  if e is null then return jsonb_build_object('ok', false); end if;
  return jsonb_build_object('ok', true, 'name', (select name from editors where id = e),
                            'admin', (select is_admin from editors where id = e),
                            'trees', (select coalesce(jsonb_agg(link order by created_at), '[]') from trees where editor = e));
end $$;

create or replace function public.save_tree(p_code text, p_link text, p_version int, p_doc jsonb, p_people jsonb)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare e uuid; adm boolean; t trees; k text; v jsonb; old jsonb;
begin
  e := _editor_for(p_code);
  if e is null then return jsonb_build_object('ok', false, 'why', 'code'); end if;
  select is_admin into adm from editors where id = e;
  select * into t from trees where link = p_link or p_link = any(old_links) for update;
  if not found then return jsonb_build_object('ok', false, 'why', 'no tree'); end if;
  if t.editor is distinct from e and not adm then return jsonb_build_object('ok', false, 'why', 'not your tree'); end if;
  if t.version <> p_version then return jsonb_build_object('ok', false, 'why', 'changed', 'version', t.version); end if;
  if pg_column_size(p_doc) > 500000 or pg_column_size(p_people) > 500000 then return jsonb_build_object('ok', false, 'why', 'too big'); end if;
  for k, v in select * from jsonb_each(coalesce(p_people, '{}')) loop
    select data into old from people where id = k;
    if old is null then
      insert into people (id, data) values (k, v);
      insert into changes (editor, tree, kind, person, after) values (e, t.id, 'add', k, v);
    elsif old is distinct from v then
      update people set data = v, updated_at = now() where id = k;
      insert into changes (editor, tree, kind, person, before, after) values (e, t.id, 'edit', k, old, v);
    end if;
  end loop;
  if t.doc is distinct from p_doc then
    insert into changes (editor, tree, kind, before, after) values (e, t.id, 'shape', t.doc, p_doc);
  end if;
  if adm then   -- Hanh's own edits need no review
    update changes set confirmed_at = now(), confirmed_by = (select name from editors where id = e)
     where tree = t.id and editor = e and confirmed_at is null;
  end if;
  update trees set doc = p_doc, version = version + 1, updated_at = now() where id = t.id;
  return jsonb_build_object('ok', true, 'version', t.version + 1);
end $$;

create or replace function public._admin_for(p_code text) returns uuid
language plpgsql security definer set search_path = public, extensions as $$
declare e uuid;
begin
  e := _editor_for(p_code);
  if e is null or not (select is_admin from editors where id = e) then return null; end if;
  return e;
end $$;
revoke all on function public._admin_for(text) from public, anon, authenticated;

create or replace function public.review_list(p_code text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  if _admin_for(p_code) is null then return jsonb_build_object('ok', false, 'why', 'code'); end if;
  return jsonb_build_object('ok', true, 'changes', (
    select coalesce(jsonb_agg(jsonb_build_object(
             'id', c.id, 'at', c.at, 'kind', c.kind, 'person', c.person, 'before', c.before, 'after', c.after,
             'editor', ed.name, 'link', t.link, 'tree', coalesce(t.name, 'Unnamed tree')) order by c.at desc, c.id desc), '[]')
      from (select * from changes where confirmed_at is null order by at desc, id desc limit 300) c
      left join editors ed on ed.id = c.editor left join trees t on t.id = c.tree));
end $$;

create or replace function public.confirm_changes(p_code text, p_ids bigint[]) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare e uuid; n int;
begin
  e := _admin_for(p_code);
  if e is null then return jsonb_build_object('ok', false, 'why', 'code'); end if;
  update changes set confirmed_at = now(), confirmed_by = (select name from editors where id = e)
   where id = any(p_ids) and confirmed_at is null;
  get diagnostics n = row_count;
  return jsonb_build_object('ok', true, 'confirmed', n);
end $$;

grant execute on function public.review_list(text) to anon, authenticated;
grant execute on function public.confirm_changes(text, bigint[]) to anon, authenticated;

select 'ready' as step4, (select count(*) from changes where confirmed_at is null) as waiting_for_review;
