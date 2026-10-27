-- Hanh's Family Tree — the picture page (Entry 143)
-- Run once in Supabase → SQL Editor after 04_rename.sql. Safe to run again.
--
-- What it adds:
--   photo_settings  — one row: the family code's bcrypt hash (the code itself is never stored; it's set separately,
--                     never in this file)
--   photos          — every picture sent: who it's of (person id), which tree(s), the sender's name, the picture
--                     (a 512 px square, as a data: URL), status pending / ok / rejected.
--                     Everyone can see pending and ok pictures (a card shows the newest one, marked Pending until
--                     Hanh confirms); rejected ones are hidden.
--   check_family_code, send_photo         — the picture page (family code checked here, same throttle as edit codes)
--   photo_review, photo_decide            — Hanh's admin code: the pictures waiting, Confirm / Reject

create table if not exists public.photo_settings (
  id         int primary key default 1 check (id = 1),
  code_hash  text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.photos (
  id          bigserial primary key,
  at          timestamptz not null default now(),
  person      text not null check (person ~ '^[A-Za-z0-9:._-]{1,60}$'),
  tree        text not null default '',         -- the tree name(s) shown on the picture page, for the review list
  sender      text not null,
  img         text not null,
  status      text not null default 'pending' check (status in ('pending', 'ok', 'rejected')),
  decided_at  timestamptz,
  decided_by  text
);
create index if not exists photos_person on public.photos (person, at desc);

alter table public.photo_settings enable row level security;
alter table public.photos         enable row level security;
drop policy if exists "public can see pictures" on public.photos;
create policy "public can see pictures" on public.photos for select to anon, authenticated using (status <> 'rejected');
revoke all on public.photo_settings from anon, authenticated;
revoke insert, update, delete on public.photos from anon, authenticated;
grant select on public.photos to anon, authenticated;

create or replace function public._family_ok(p_code text) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare ok boolean;
begin
  if (select count(*) from code_failures where at > now() - interval '10 minutes') >= 30 then
    raise exception 'Too many tries — wait a few minutes';
  end if;
  select exists (select 1 from photo_settings where code_hash = crypt(upper(trim(p_code)), code_hash)) into ok;
  if not ok then
    insert into code_failures default values;
    delete from code_failures where at < now() - interval '1 day';
    perform pg_sleep(0.6);
  end if;
  return ok;
end $$;
revoke all on function public._family_ok(text) from public, anon, authenticated;

-- the picture page asks for the family code once per phone
create or replace function public.check_family_code(p_code text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  return jsonb_build_object('ok', _family_ok(p_code));
end $$;

create or replace function public.send_photo(p_code text, p_person text, p_tree text, p_sender text, p_img text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare nid bigint; s text := btrim(coalesce(p_sender, ''));
begin
  if not _family_ok(p_code) then return jsonb_build_object('ok', false, 'why', 'code'); end if;
  if s = '' or length(s) > 60 then return jsonb_build_object('ok', false, 'why', 'name'); end if;
  if p_person is null or p_person !~ '^[A-Za-z0-9:._-]{1,60}$' then return jsonb_build_object('ok', false, 'why', 'person'); end if;
  if p_img is null or p_img !~ '^data:image/(webp|jpeg);base64,[A-Za-z0-9+/=]+$' then return jsonb_build_object('ok', false, 'why', 'picture'); end if;
  if length(p_img) > 250000 then return jsonb_build_object('ok', false, 'why', 'too big'); end if;
  if (select count(*) from photos where at > now() - interval '1 hour') >= 120 then
    return jsonb_build_object('ok', false, 'why', 'busy');
  end if;
  insert into photos (person, tree, sender, img) values (p_person, left(coalesce(p_tree, ''), 200), s, p_img) returning id into nid;
  return jsonb_build_object('ok', true, 'id', nid);
end $$;

-- Hanh: the pictures waiting (with the picture each would replace, if any)
create or replace function public.photo_review(p_code text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  if _admin_for(p_code) is null then return jsonb_build_object('ok', false, 'why', 'code'); end if;
  return jsonb_build_object('ok', true, 'photos', (
    select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'at', p.at, 'person', p.person, 'tree', p.tree,
             'sender', p.sender, 'img', p.img,
             'prev', (select q.img from photos q where q.person = p.person and q.status = 'ok' and q.at < p.at
                       order by q.at desc limit 1)) order by p.at desc), '[]')
      from photos p where p.status = 'pending'));
end $$;

create or replace function public.photo_decide(p_code text, p_ids bigint[], p_ok boolean) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare e uuid; n int;
begin
  e := _admin_for(p_code);
  if e is null then return jsonb_build_object('ok', false, 'why', 'code'); end if;
  update photos set status = case when p_ok then 'ok' else 'rejected' end, decided_at = now(),
         decided_by = (select name from editors where id = e)
   where id = any(p_ids) and status = 'pending';
  get diagnostics n = row_count;
  return jsonb_build_object('ok', true, 'done', n);
end $$;

grant execute on function public.check_family_code(text) to anon, authenticated;
grant execute on function public.send_photo(text, text, text, text, text) to anon, authenticated;
grant execute on function public.photo_review(text) to anon, authenticated;
grant execute on function public.photo_decide(text, bigint[], boolean) to anon, authenticated;

select 'ready' as pictures_step, (select count(*) from photo_settings) as family_code_set, (select count(*) from photos) as pictures;
