-- Hanh's Family Tree — rename any tree, the four built-in ones too (Entry 182)
-- Run once in Supabase → SQL Editor after 07_photo_remove.sql. Safe to run again.
--
-- tree_names       — a new name for a built-in tree (hanh-paternal, hanh-maternal, huong-paternal, huong-maternal).
--                    Everyone can read it; nobody writes to it directly.
-- rename_any_tree  — admin code only. A tree kept in the database (Minh's, or one started from Admin) is renamed in
--                    place through rename_tree; a built-in tree gets its new name saved in tree_names.

create table if not exists public.tree_names (
  link       text primary key check (link ~ '^[a-z0-9-]{1,40}$'),
  name       text not null check (length(btrim(name)) between 1 and 60),
  updated_at timestamptz not null default now(),
  updated_by text
);
alter table public.tree_names enable row level security;
drop policy if exists tree_names_read on public.tree_names;
create policy tree_names_read on public.tree_names for select to anon, authenticated using (true);
revoke insert, update, delete on public.tree_names from anon, authenticated;
grant select on public.tree_names to anon, authenticated;

create or replace function public.rename_any_tree(p_code text, p_link text, p_name text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare e uuid; adm boolean; who text; n text := btrim(coalesce(p_name, '')); l text := btrim(coalesce(p_link, ''));
begin
  e := _editor_for(p_code);
  if e is null then return jsonb_build_object('ok', false, 'why', 'code'); end if;
  select is_admin, name into adm, who from editors where id = e;
  if not coalesce(adm, false) then return jsonb_build_object('ok', false, 'why', 'not admin'); end if;
  if n = '' or length(n) > 60 then return jsonb_build_object('ok', false, 'why', 'name'); end if;
  if l !~ '^[a-z0-9-]{1,40}$' then return jsonb_build_object('ok', false, 'why', 'link'); end if;
  if exists (select 1 from trees where link = l or l = any(old_links)) then
    return rename_tree(p_code, l, n);
  end if;
  insert into tree_names (link, name, updated_by) values (l, n, who)
  on conflict (link) do update set name = excluded.name, updated_at = now(), updated_by = excluded.updated_by;
  return jsonb_build_object('ok', true, 'name', n);
end $$;

grant execute on function public.rename_any_tree(text, text, text) to anon, authenticated;

select 'ready' as tree_names_step, (select count(*) from public.tree_names) as renamed_built_in_trees;
