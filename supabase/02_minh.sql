-- Hanh's Family Tree — Minh's page, step 2: live saving (Entries 126, 131, 132)
-- Run once in Supabase → SQL Editor. Safe to run again (it only adds what is missing).
--
-- What it makes:
--   editors  — who may edit; each editor's code is stored only as a hash (bcrypt). The code itself is NEVER in this file
--              or the repo: Hanh adds it with a separate one-line statement given in chat.
--   trees    — one row per tree. id = permanent hidden ID; link = the renameable link name (?tree=<link>);
--              old_links keeps earlier link names so shared links still open the right tree (Entry 131).
--              doc = the tree's shape (who is in which family box, birth order); version guards against overwriting.
--   people   — one record per person, shared by every tree that has them (Entry 126: "Shared, one record").
--   changes  — every edit, for Hanh's review list (step 4): what changed, before / after, confirmed or not.
-- Who can do what:
--   anyone (the publishable key): READ trees and people. Nothing else — no direct writes to any table.
--   saving: only through the functions below, which check the editor's code inside Supabase.

create extension if not exists pgcrypto;

create table if not exists public.editors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  code_hash  text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.trees (
  id         uuid primary key default gen_random_uuid(),
  link       text not null unique check (link ~ '^[a-z0-9-]{1,40}$'),
  old_links  text[] not null default '{}',
  name       text,
  editor     uuid references public.editors(id),
  doc        jsonb not null,
  version    int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.people (
  id         text primary key check (id ~ '^[A-Za-z0-9:._-]{1,60}$'),
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.changes (
  id           bigserial primary key,
  at           timestamptz not null default now(),
  editor       uuid references public.editors(id),
  tree         uuid references public.trees(id),
  kind         text not null,            -- 'add' · 'edit' · 'shape' (who belongs where / birth order) · 'tree' (new tree)
  person       text,
  before       jsonb,
  after        jsonb,
  confirmed_at timestamptz,
  confirmed_by text
);
create index if not exists changes_unconfirmed on public.changes (at) where confirmed_at is null;

create table if not exists public.code_failures (at timestamptz not null default now());

-- ---------- who can read what ----------
alter table public.editors       enable row level security;
alter table public.trees         enable row level security;
alter table public.people        enable row level security;
alter table public.changes       enable row level security;
alter table public.code_failures enable row level security;
drop policy if exists "public can read trees"  on public.trees;
drop policy if exists "public can read people" on public.people;
create policy "public can read trees"  on public.trees  for select to anon, authenticated using (true);
create policy "public can read people" on public.people for select to anon, authenticated using (true);
revoke all on public.editors, public.changes, public.code_failures from anon, authenticated;
revoke insert, update, delete on public.trees, public.people from anon, authenticated;
grant select on public.trees, public.people to anon, authenticated;

-- ---------- the code check (inside Supabase) ----------
-- Too many wrong codes in 10 minutes (any visitor) → everyone waits; slows anyone guessing.
create or replace function public._editor_for(p_code text) returns uuid
language plpgsql security definer set search_path = public, extensions as $$
declare e uuid;
begin
  if (select count(*) from code_failures where at > now() - interval '10 minutes') >= 30 then
    raise exception 'Too many tries — wait a few minutes';
  end if;
  select id into e from editors where code_hash = crypt(upper(trim(p_code)), code_hash);
  if e is null then
    insert into code_failures default values;
    delete from code_failures where at < now() - interval '1 day';
    perform pg_sleep(0.6);
  end if;
  return e;
end $$;
revoke all on function public._editor_for(text) from public, anon, authenticated;

-- "code asked once": the page checks the code when it's typed, then remembers it on that device
create or replace function public.check_code(p_code text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare e uuid;
begin
  e := _editor_for(p_code);
  if e is null then return jsonb_build_object('ok', false); end if;
  return jsonb_build_object('ok', true, 'name', (select name from editors where id = e),
                            'trees', (select coalesce(jsonb_agg(link order by created_at), '[]') from trees where editor = e));
end $$;

-- save: the whole tree shape + the people that changed; every difference goes into changes for Hanh's review
create or replace function public.save_tree(p_code text, p_link text, p_version int, p_doc jsonb, p_people jsonb)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare e uuid; t trees; k text; v jsonb; old jsonb;
begin
  e := _editor_for(p_code);
  if e is null then return jsonb_build_object('ok', false, 'why', 'code'); end if;
  select * into t from trees where link = p_link or p_link = any(old_links) for update;
  if not found then return jsonb_build_object('ok', false, 'why', 'no tree'); end if;
  if t.editor is distinct from e then return jsonb_build_object('ok', false, 'why', 'not your tree'); end if;
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
  update trees set doc = p_doc, version = version + 1, updated_at = now() where id = t.id;
  return jsonb_build_object('ok', true, 'version', t.version + 1);
end $$;

-- a new tree (Entry 131: "＋ Start a new tree")
create or replace function public.create_tree(p_code text, p_link text, p_name text, p_doc jsonb, p_people jsonb)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare e uuid; nid uuid; k text; v jsonb;
begin
  e := _editor_for(p_code);
  if e is null then return jsonb_build_object('ok', false, 'why', 'code'); end if;
  if exists (select 1 from trees where link = p_link or p_link = any(old_links)) then return jsonb_build_object('ok', false, 'why', 'link taken'); end if;
  insert into trees (link, name, editor, doc) values (p_link, p_name, e, p_doc) returning id into nid;
  for k, v in select * from jsonb_each(coalesce(p_people, '{}')) loop
    insert into people (id, data) values (k, v) on conflict (id) do nothing;
  end loop;
  insert into changes (editor, tree, kind, after) values (e, nid, 'tree', jsonb_build_object('link', p_link, 'name', p_name));
  return jsonb_build_object('ok', true, 'id', nid);
end $$;

grant execute on function public.check_code(text) to anon, authenticated;
grant execute on function public.save_tree(text, text, int, jsonb, jsonb) to anon, authenticated;
grant execute on function public.create_tree(text, text, text, jsonb, jsonb) to anon, authenticated;

-- ---------- Minh's first tree: Thương's parents, unnamed (Entry 126) ----------
insert into public.people (id, data) values
  ('minh-p1', '{"first":"","middle":"","last":"","alt":"","g":"M","dead":false}'),
  ('minh-p2', '{"first":"","middle":"","last":"","alt":"","g":"F","dead":false}')
on conflict (id) do nothing;
insert into public.trees (link, doc) values ('thuong', '{"k":["minh-p1","minh-p2"],"c":[]}')
on conflict (link) do nothing;

select link, version, doc from public.trees;   -- should show: thuong | 1 | {"c": [], "k": ["minh-p1", "minh-p2"]}
