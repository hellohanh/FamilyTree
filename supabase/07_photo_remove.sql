-- Hanh's Family Tree — remove a confirmed picture (Entry 155)
-- Run once in Supabase → SQL Editor after 06_updates.sql. Safe to run again.
-- photo_remove — Hanh's admin code: takes every picture of a person off the cards (marked rejected, so the drawing
--                comes back); kept in the table with who removed it and when.

create or replace function public.photo_remove(p_code text, p_person text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare e uuid; n int;
begin
  e := _admin_for(p_code);
  if e is null then return jsonb_build_object('ok', false, 'why', 'code'); end if;
  update photos set status = 'rejected', decided_at = now(), decided_by = (select name from editors where id = e)
   where person = p_person and status <> 'rejected';
  get diagnostics n = row_count;
  return jsonb_build_object('ok', true, 'removed', n);
end $$;

grant execute on function public.photo_remove(text, text) to anon, authenticated;

select 'ready' as photo_remove_step;
