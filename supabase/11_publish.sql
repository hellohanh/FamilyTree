-- Hanh's Family Tree — publishing trees (Entry 201)
-- Run once in Supabase → SQL Editor after 10_link_son_trung_van.sql. Safe to run again.
--
-- A tree kept in the database (started on the editors' page or from Admin → Start a new tree) is PRIVATE until its
-- editor (or Hanh) publishes it:
--   trees.published   — false for new trees. Only published trees (and their people) can be read by the public;
--                       an unpublished tree is handed out only to its editor or Hanh, by code.
--   get_tree          — (code, link) → the tree and its people: anyone for a published tree; its editor / Hanh otherwise.
--   tree_list         — (code) → the trees this code may see: Hanh all; an editor their own + the published ones.
--   set_published     — (code, link, on) → its editor or Hanh publishes / unpublishes it, straight away (logged).
-- First run only: "Hạnh's (Hậu/Thường) Paternal Grandma & Siblings" and "Sơn's (Trung/Văn) Paternal Grandparents" start
-- published; Minh's tree (thuong) starts unpublished (Hanh, 2026-10-29). Later runs never change who is published.

do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'trees' and column_name = 'published') then
    alter table public.trees add column published boolean not null default false;
    update public.trees set published = true where link in ('hanh-maternal-grandpa', 'son-s-trung-van-paternal-grandparents');
  end if;
end $$;

-- the public reads only published trees, and only the people in them
drop policy if exists "public can read trees" on public.trees;
drop policy if exists "public can read published trees" on public.trees;
create policy "public can read published trees" on public.trees for select to anon, authenticated using (published);
drop policy if exists "public can read people" on public.people;
drop policy if exists "public can read people in published trees" on public.people;
create policy "public can read people in published trees" on public.people for select to anon, authenticated
  using (exists (select 1 from public.trees t where t.published and position('"' || people.id || '"' in t.doc::text) > 0));

create or replace function public.get_tree(p_code text, p_link text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare e uuid; adm boolean := false; t trees;
begin
  select * into t from trees where link = lower(btrim(p_link)) or lower(btrim(p_link)) = any(old_links);
  if not found then return jsonb_build_object('ok', false, 'why', 'no tree'); end if;
  if not t.published then
    if coalesce(btrim(p_code), '') = '' then return jsonb_build_object('ok', false, 'why', 'not published'); end if;
    e := _editor_for(p_code);
    if e is null then return jsonb_build_object('ok', false, 'why', 'code'); end if;
    select is_admin into adm from editors where id = e;
    if t.editor is distinct from e and not adm then return jsonb_build_object('ok', false, 'why', 'not published'); end if;
  end if;
  return jsonb_build_object('ok', true,
    'tree', jsonb_build_object('id', t.id, 'link', t.link, 'old_links', t.old_links, 'name', t.name, 'doc', t.doc,
                               'version', t.version, 'published', t.published),
    'people', (select coalesce(jsonb_object_agg(p.id, p.data), '{}') from people p where position('"' || p.id || '"' in t.doc::text) > 0));
end $$;

create or replace function public.tree_list(p_code text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare e uuid; adm boolean := false;
begin
  if coalesce(btrim(p_code), '') <> '' then
    e := _editor_for(p_code);
    if e is not null then select is_admin into adm from editors where id = e; end if;
  end if;
  return jsonb_build_object('ok', true, 'admin', coalesce(adm, false), 'trees', (
    select coalesce(jsonb_agg(jsonb_build_object('link', t.link, 'name', t.name, 'created_at', t.created_at,
                                                 'published', t.published, 'mine', e is not null and t.editor = e)
                              order by t.created_at), '[]')
      from trees t where t.published or adm or (e is not null and t.editor = e)));
end $$;

create or replace function public.set_published(p_code text, p_link text, p_on boolean) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare e uuid; adm boolean; t trees;
begin
  e := _editor_for(p_code);
  if e is null then return jsonb_build_object('ok', false, 'why', 'code'); end if;
  select is_admin into adm from editors where id = e;
  select * into t from trees where link = p_link or p_link = any(old_links) for update;
  if not found then return jsonb_build_object('ok', false, 'why', 'no tree'); end if;
  if t.editor is distinct from e and not adm then return jsonb_build_object('ok', false, 'why', 'not your tree'); end if;
  if t.published is distinct from coalesce(p_on, false) then
    update trees set published = coalesce(p_on, false), updated_at = now() where id = t.id;
    insert into changes (editor, tree, kind, before, after, confirmed_at, confirmed_by)
      values (e, t.id, 'publish', jsonb_build_object('published', t.published), jsonb_build_object('published', coalesce(p_on, false)),
              now(), (select name from editors where id = e));
  end if;
  return jsonb_build_object('ok', true, 'published', coalesce(p_on, false));
end $$;

grant execute on function public.get_tree(text, text) to anon, authenticated;
grant execute on function public.tree_list(text) to anon, authenticated;
grant execute on function public.set_published(text, text, boolean) to anon, authenticated;

select 'ready' as publish_step,
       (select string_agg(coalesce(name, link) || case when published then ' (published)' else ' (private)' end, ' · ' order by created_at) from public.trees) as trees;
