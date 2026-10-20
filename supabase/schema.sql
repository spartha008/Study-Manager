-- =============================================================================
-- StudyBuddy - Supabase Schema
-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
--
-- Creates one row per authenticated user holding their entire workspace
-- (assignments, timetable, notes and focus stats) as JSON, protected by
-- Row Level Security so nobody can read or touch anyone else's data.
-- =============================================================================

create table if not exists public.studybuddy_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb    not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Row Level Security: each user can only ever touch their own row.
alter table public.studybuddy_state enable row level security;

drop policy if exists "Users read own state" on public.studybuddy_state;
create policy "Users read own state"
  on public.studybuddy_state for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own state" on public.studybuddy_state;
create policy "Users insert own state"
  on public.studybuddy_state for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own state" on public.studybuddy_state;
create policy "Users update own state"
  on public.studybuddy_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Keep updated_at fresh on every write.
create or replace function public.studybuddy_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists studybuddy_state_touch on public.studybuddy_state;
create trigger studybuddy_state_touch
  before update on public.studybuddy_state
  for each row
  execute function public.studybuddy_touch_updated_at();
