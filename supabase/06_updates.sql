-- Hanh's Family Tree — "Suggest an update" on the main page (Entry 144)
-- Run once in Supabase → SQL Editor after 05_photos.sql. Safe to run again.
--
-- updates — each saved suggestion: the sender's name, a one-line summary for the review list, and the list of
--           changes (ops) the main page applies on top of Hạnh's tree:
--             {"op":"edit","id":<person>,"set":{field: new value},"was":{field: old value}}
--             {"op":"spouse","id":<new id>,"to":<box's first person>,"at":<n>,"person":{...}}
--             {"op":"child","id":<new id>,"to":<parent box's first person>,"at":<n>,"m":<other parent or null>,"person":{...}}
--           status pending → shown at once, marked Pending; ok → part of the tree; rejected → hidden.
-- send_update   — the family code (same as the picture page), name required
-- update_review / update_decide — Hanh's admin code: Confirm / Reject

create table if not exists public.updates (
  id          bigserial primary key,
  at          timestamptz not null default now(),
  sender      text not null,
  summary     text not null default '',
  ops         jsonb not null,
  status      text not null default 'pending' check (status in ('pending', 'ok', 'rejected')),
  decided_at  timestamptz,
  decided_by  text
);

alter table public.updates enable row level security;
drop policy if exists "public can see updates" on public.updates;
create policy "public can see updates" on public.updates for select to anon, authenticated using (status <> 'rejected');
revoke insert, update, delete on public.updates from anon, authenticated;
grant select on public.updates to anon, authenticated;

create or replace function public.send_update(p_code text, p_sender text, p_summary text, p_ops jsonb)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare nid bigint; s text := btrim(coalesce(p_sender, ''));
begin
  if not _family_ok(p_code) then return jsonb_build_object('ok', false, 'why', 'code'); end if;
  if s = '' or length(s) > 60 then return jsonb_build_object('ok', false, 'why', 'name'); end if;
  if p_ops is null or jsonb_typeof(p_ops) <> 'array' or jsonb_array_length(p_ops) = 0 then
    return jsonb_build_object('ok', false, 'why', 'nothing changed');
  end if;
  if jsonb_array_length(p_ops) > 20 or pg_column_size(p_ops) > 20000 then return jsonb_build_object('ok', false, 'why', 'too big'); end if;
  if (select count(*) from updates where at > now() - interval '1 hour') >= 120 then
    return jsonb_build_object('ok', false, 'why', 'busy');
  end if;
  insert into updates (sender, summary, ops) values (s, left(coalesce(p_summary, ''), 300), p_ops) returning id into nid;
  return jsonb_build_object('ok', true, 'id', nid);
end $$;

create or replace function public.update_review(p_code text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  if _admin_for(p_code) is null then return jsonb_build_object('ok', false, 'why', 'code'); end if;
  return jsonb_build_object('ok', true, 'updates', (
    select coalesce(jsonb_agg(jsonb_build_object('id', u.id, 'at', u.at, 'sender', u.sender, 'summary', u.summary, 'ops', u.ops)
             order by u.at desc), '[]')
      from updates u where u.status = 'pending'));
end $$;

create or replace function public.update_decide(p_code text, p_ids bigint[], p_ok boolean) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare e uuid; n int;
begin
  e := _admin_for(p_code);
  if e is null then return jsonb_build_object('ok', false, 'why', 'code'); end if;
  update updates set status = case when p_ok then 'ok' else 'rejected' end, decided_at = now(),
         decided_by = (select name from editors where id = e)
   where id = any(p_ids) and status = 'pending';
  get diagnostics n = row_count;
  return jsonb_build_object('ok', true, 'done', n);
end $$;

grant execute on function public.send_update(text, text, text, jsonb) to anon, authenticated;
grant execute on function public.update_review(text) to anon, authenticated;
grant execute on function public.update_decide(text, bigint[], boolean) to anon, authenticated;

select 'ready' as updates_step, (select count(*) from updates) as updates;
