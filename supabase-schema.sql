-- русский уголок ♡  Single-person cloud saving, with NO email login.
-- Supabase → SQL Editor → New query → paste all of this → Run.
-- IMPORTANT: run the very last SELECT to see your secret sync code.
-- Keep that code private. It grants access to your personal study notes.

-- One private row for this whole personal website.
create table if not exists public.russki_single_save (
  id integer primary key default 1 check (id = 1),
  code uuid not null default gen_random_uuid(),
  payload jsonb not null default '{}'::jsonb,
  revision bigint not null default 0,
  updated_at timestamptz not null default now()
);

insert into public.russki_single_save (id) values (1)
on conflict (id) do nothing;

-- No browser is allowed to read or write the row directly, not even with
-- the public Supabase API key. Only the two code-protected functions below may.
alter table public.russki_single_save enable row level security;
revoke all on public.russki_single_save from public, anon, authenticated;

-- Only return state when the caller presents the correct secret code.
create or replace function public.russki_load(p_code uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare result jsonb;
begin
  select jsonb_build_object(
    'payload', s.payload,
    'revision', s.revision,
    'updated_at', s.updated_at
  ) into result
  from public.russki_single_save as s
  where s.id = 1 and s.code = p_code;
  if result is null then
    raise exception 'Sync code not recognised.' using errcode = 'P0001';
  end if;
  return result;
end;
$$;

-- Optimistic locking stops one device silently overwriting newer changes
-- from another device. Each successful save advances the revision number.
create or replace function public.russki_save(
  p_code uuid,
  p_payload jsonb,
  p_expected_revision bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare result jsonb;
begin
  if p_payload is null or jsonb_typeof(p_payload) <> 'object'
     or pg_column_size(p_payload) > 2000000 then
    raise exception 'Invalid or oversized study backup.' using errcode = 'P0001';
  end if;

  update public.russki_single_save as s
  set payload = p_payload, revision = s.revision + 1, updated_at = now()
  where s.id = 1 and s.code = p_code and s.revision = p_expected_revision
  returning jsonb_build_object(
    'payload', s.payload,
    'revision', s.revision,
    'updated_at', s.updated_at
  ) into result;

  if result is null then
    if exists(select 1 from public.russki_single_save where id = 1 and code = p_code) then
      raise exception 'SYNC_CONFLICT: another device has newer progress.' using errcode = 'P0001';
    end if;
    raise exception 'Sync code not recognised.' using errcode = 'P0001';
  end if;
  return result;
end;
$$;

revoke all on function public.russki_load(uuid) from public;
revoke all on function public.russki_save(uuid,jsonb,bigint) from public;
grant execute on function public.russki_load(uuid) to anon, authenticated;
grant execute on function public.russki_save(uuid,jsonb,bigint) to anon, authenticated;

-- This private code only appears in the SQL Editor, NOT on your public site.
-- If you run the script again it keeps the existing code and progress.
select code as "COPY THIS PRIVATE SYNC CODE INTO THE WEBSITE" from public.russki_single_save where id = 1;
