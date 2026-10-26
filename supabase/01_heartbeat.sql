-- Hanh's Family Tree v2 — step 4 of the setup (Entry 75)
-- A one-row "heartbeat" table. The keep-awake job (.github/workflows/keep-awake.yml) reads it every 3 days so the
-- free Supabase project never reaches its 7-day sleep. Read-only for the public; nothing else is created yet —
-- the people / photos / change-log tables come later, once the v2 design is approved.

create table if not exists public.heartbeat (
  id       int primary key,
  beat_at  timestamptz not null default now()
);
insert into public.heartbeat (id) values (1) on conflict (id) do nothing;

alter table public.heartbeat enable row level security;
drop policy if exists "public can read heartbeat" on public.heartbeat;
create policy "public can read heartbeat" on public.heartbeat for select to anon, authenticated using (true);
grant select on public.heartbeat to anon, authenticated;

select * from public.heartbeat;   -- should show one row: 1 | (today's date)
