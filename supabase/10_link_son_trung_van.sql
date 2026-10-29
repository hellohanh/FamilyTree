-- Hanh's Family Tree — link Sơn's (Trung/Văn) Paternal Grandparents to Hạnh's Paternal Grandpa & Siblings (Entry 200)
-- Run once in Supabase → SQL Editor. Safe to run again (it does nothing the second time).
--
-- Văn & Trung and everyone under them (11 people) become SHARED records with Hạnh's tree: the new tree's own ids
-- (m-…) are swapped for Hạnh's ids (hp:<cell>), the same way Minh's tree shares Bà Thương's family (Entry 135).
-- Last name Trần kept for Văn, Trung, Sơn, Thủy, Thảo Huyền, Hoàng (Hanh, 2026-10-29). Nothing else in the tree changes.

begin;

-- 1. the shared records (one per person, id = Hạnh's cell)
insert into public.people (id, data) values ('hp:W315', '{"g": "F", "alt": "", "dead": false, "last": "Trần", "first": "Văn", "middle": "", "src": "H.HN.T Paternal Tree!W315"}'::jsonb)
  on conflict (id) do update set data = excluded.data, updated_at = now();   -- Văn
insert into public.people (id, data) values ('hp:W317', '{"g": "M", "alt": "", "dead": false, "last": "Trần", "first": "Trung", "middle": "", "adopted": false, "src": "H.HN.T Paternal Tree!W317"}'::jsonb)
  on conflict (id) do update set data = excluded.data, updated_at = now();   -- Trung
insert into public.people (id, data) values ('hp:AF320', '{"g": "M", "alt": "", "dead": false, "last": "Trần", "first": "Sơn", "middle": "", "adopted": false, "src": "H.HN.T Paternal Tree!AF320"}'::jsonb)
  on conflict (id) do update set data = excluded.data, updated_at = now();   -- Sơn
insert into public.people (id, data) values ('hp:AF322', '{"g": "F", "alt": "", "dead": false, "last": "", "first": "Sương", "middle": "", "src": "H.HN.T Paternal Tree!AF322"}'::jsonb)
  on conflict (id) do update set data = excluded.data, updated_at = now();   -- Sương
insert into public.people (id, data) values ('hp:AP325', '{"g": "F", "alt": "Rockii", "dead": false, "last": "", "first": "Cát Linh", "middle": "", "src": "H.HN.T Paternal Tree!AP325"}'::jsonb)
  on conflict (id) do update set data = excluded.data, updated_at = now();   -- Cát Linh
insert into public.people (id, data) values ('hp:AF328', '{"g": "F", "alt": "", "dead": false, "last": "Trần", "first": "Thủy", "middle": "", "src": "H.HN.T Paternal Tree!AF328"}'::jsonb)
  on conflict (id) do update set data = excluded.data, updated_at = now();   -- Thủy
insert into public.people (id, data) values ('hp:AF331', '{"g": "F", "alt": "", "dead": false, "last": "Trần", "first": "Thảo Huyền", "middle": "", "adopted": false, "src": "H.HN.T Paternal Tree!AF331"}'::jsonb)
  on conflict (id) do update set data = excluded.data, updated_at = now();   -- Thảo Huyền
insert into public.people (id, data) values ('hp:AF333', '{"g": "M", "alt": "", "dead": false, "last": "", "first": "Trưởng", "middle": "", "src": "H.HN.T Paternal Tree!AF333"}'::jsonb)
  on conflict (id) do update set data = excluded.data, updated_at = now();   -- Trưởng
insert into public.people (id, data) values ('hp:AP336', '{"g": "M", "alt": "Ryan", "dead": false, "last": "", "first": "Vinh", "middle": "", "adopted": false, "src": "H.HN.T Paternal Tree!AP336"}'::jsonb)
  on conflict (id) do update set data = excluded.data, updated_at = now();   -- Vinh
insert into public.people (id, data) values ('hp:AP339', '{"g": "F", "alt": "Payton", "dead": false, "last": "", "first": "Đan Linh", "middle": "", "src": "H.HN.T Paternal Tree!AP339"}'::jsonb)
  on conflict (id) do update set data = excluded.data, updated_at = now();   -- Đan Linh
insert into public.people (id, data) values ('hp:AF342', '{"g": "M", "alt": "", "dead": false, "last": "Trần", "first": "Hoàng", "middle": "", "src": "H.HN.T Paternal Tree!AF342"}'::jsonb)
  on conflict (id) do update set data = excluded.data, updated_at = now();   -- Hoàng

-- 2. the tree uses them instead of its own copies (only if it still has its own copies)
do $$
declare t public.trees; s text; p record; n int := 0;
begin
  select * into t from public.trees where link = 'son-s-trung-van-paternal-grandparents' for update;
  if not found then raise exception 'Tree not found: son-s-trung-van-paternal-grandparents'; end if;
  s := t.doc::text;
  for p in select * from (values
    ('m-mvu3iz4bq55e', 'hp:W315'),
    ('m-mvu3dwugwyva', 'hp:W317'),
    ('m-mvu3pf42d8dv', 'hp:AF320'),
    ('m-mvu43fpuudue', 'hp:AF322'),
    ('m-mvu44edc9uvw', 'hp:AP325'),
    ('m-mvu3q3p6ryhc', 'hp:AF328'),
    ('m-mvu3qhv6okq3', 'hp:AF331'),
    ('m-mvu459h398o4', 'hp:AF333'),
    ('m-mvu44rglla1c', 'hp:AP336'),
    ('m-mvu464ko0fhi', 'hp:AP339'),
    ('m-mvu3r8rs07h7', 'hp:AF342')
  ) as x(old_id, new_id) loop
    if position('"' || p.old_id || '"' in s) > 0 then
      s := replace(s, '"' || p.old_id || '"', '"' || p.new_id || '"');
      n := n + 1;
    end if;
  end loop;
  if n > 0 then
    insert into public.changes (editor, tree, kind, before, after, confirmed_at, confirmed_by)
      select e.id, t.id, 'shape', t.doc, s::jsonb, now(), e.name from public.editors e where e.is_admin order by e.created_at limit 1;
    update public.trees set doc = s::jsonb, version = version + 1, updated_at = now() where id = t.id;
    delete from public.people where id in ('m-mvu3iz4bq55e', 'm-mvu3dwugwyva', 'm-mvu3pf42d8dv', 'm-mvu43fpuudue', 'm-mvu44edc9uvw', 'm-mvu3q3p6ryhc', 'm-mvu3qhv6okq3', 'm-mvu459h398o4', 'm-mvu44rglla1c', 'm-mvu464ko0fhi', 'm-mvu3r8rs07h7');
  end if;
  raise notice 'linked % people', n;
end $$;

commit;

select 'ready' as link_step,
       (select count(*) from public.people where id in ('hp:W315', 'hp:W317', 'hp:AF320', 'hp:AF322', 'hp:AP325', 'hp:AF328', 'hp:AF331', 'hp:AF333', 'hp:AP336', 'hp:AP339', 'hp:AF342')) as shared_people,
       (select doc::text like '%hp:W317%' from public.trees where link = 'son-s-trung-van-paternal-grandparents') as tree_uses_them;
