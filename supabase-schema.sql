-- Paste into Supabase > SQL Editor > New query, and click Run.
-- You must also enable Email authentication (enabled by default in many projects).
-- This table stores one JSON study-state document per signed-in user.
create table if not exists public.user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;

-- Each user can only access their own progress.
create policy "read own study state" on public.user_state
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "create own study state" on public.user_state
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own study state" on public.user_state
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "delete own study state" on public.user_state
  for delete to authenticated using ((select auth.uid()) = user_id);

-- If policies already exist from a previous run, ignore the duplicate-policy error
-- or remove the old policies before rerunning.
