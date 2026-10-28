-- Hanh's Family Tree — a full copy of the family database for Hanh (Entry 189)
-- Run once in Supabase → SQL Editor after 08_tree_names.sql. Safe to run again.
--
-- backup_all  — admin code only. Returns everything the family has added in Supabase, in one go:
--               trees (Minh's and any started from Admin) · people · changes (Minh's edit history) ·
--               photos (with the picture itself) · updates (Edit Tree) · tree_names · editors (names only).
--               Rejected pictures and updates are included, marked rejected (Hanh's choice).
--               No codes: editors' and the family code's hashes are never in the copy.

create or replace function public.backup_all(p_code text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  if _admin_for(p_code) is null then return jsonb_build_object('ok', false, 'why', 'not admin'); end if;
  return jsonb_build_object(
    'ok', true,
    'at', now(),
    'trees',      coalesce((select jsonb_agg(to_jsonb(t) order by t.created_at) from trees t), '[]'::jsonb),
    'people',     coalesce((select jsonb_agg(to_jsonb(p) order by p.id) from people p), '[]'::jsonb),
    'changes',    coalesce((select jsonb_agg(to_jsonb(c) order by c.id) from changes c), '[]'::jsonb),
    'photos',     coalesce((select jsonb_agg(to_jsonb(f) order by f.id) from photos f), '[]'::jsonb),
    'updates',    coalesce((select jsonb_agg(to_jsonb(u) order by u.id) from updates u), '[]'::jsonb),
    'tree_names', coalesce((select jsonb_agg(to_jsonb(n) order by n.link) from tree_names n), '[]'::jsonb),
    'editors',    coalesce((select jsonb_agg(jsonb_build_object('id', e.id, 'name', e.name, 'is_admin', e.is_admin,
                                                              'created_at', e.created_at) order by e.created_at)
                            from editors e), '[]'::jsonb));
end $$;

revoke all on function public.backup_all(text) from public;
grant execute on function public.backup_all(text) to anon, authenticated;

select 'ready' as backup_step, (select count(*) from public.photos) as pictures_in_database;
