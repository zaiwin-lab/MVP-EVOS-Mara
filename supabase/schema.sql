-- ══════════════════════════════════════════════════════════════
-- KBT EventOS — Attendify™  ·  Supabase schema
-- ══════════════════════════════════════════════════════════════
-- OPTIONAL. The app runs fully on-device (localStorage) with no
-- backend. Run this only when you want a SHARED backend so the admin
-- dashboard sees every participant's phone in real time.
--
-- How to use:
--   1. Create a free project at https://supabase.com
--   2. Open the SQL Editor and paste + run this whole file
--   3. Copy Project URL + anon key into the app's .env:
--        VITE_SUPABASE_URL=...
--        VITE_SUPABASE_ANON_KEY=...
--   4. Redeploy. The app auto-detects the env and switches backend.
--
-- Rich objects are stored as JSONB `data` columns to keep the app
-- mapping trivial and reliable for the MVP.
-- ══════════════════════════════════════════════════════════════

create table if not exists participants (
  id           text primary key,
  event_slug   text not null,
  mobile       text,
  data         jsonb not null,
  created_at   timestamptz not null default now()
);
create index if not exists participants_event_idx on participants (event_slug);
create index if not exists participants_mobile_idx on participants (event_slug, mobile);

create table if not exists company_profiles (
  participant_id text primary key references participants (id) on delete cascade,
  data           jsonb not null,
  updated_at     timestamptz not null default now()
);

create table if not exists assessment_results (
  participant_id text primary key references participants (id) on delete cascade,
  total_score    int,
  data           jsonb not null,
  completed_at   timestamptz not null default now()
);

create table if not exists action_plans (
  participant_id text primary key references participants (id) on delete cascade,
  data           jsonb not null,
  submitted_at   timestamptz not null default now()
);

create table if not exists reflections (
  id             text primary key,               -- `${participant_id}:${day}`
  participant_id text references participants (id) on delete cascade,
  day_number     int,
  data           jsonb not null,
  submitted_at   timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────────
-- The MVP uses the anon key from the browser. For a 3-day supervised
-- event with ~20 participants, we allow anon read/write on these
-- tables. TIGHTEN THIS before any long-term or public deployment
-- (e.g. move writes behind an Edge Function or authenticated role).
alter table participants        enable row level security;
alter table company_profiles    enable row level security;
alter table assessment_results  enable row level security;
alter table action_plans        enable row level security;
alter table reflections         enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'participants','company_profiles','assessment_results','action_plans','reflections'
  ] loop
    execute format('drop policy if exists anon_all on %I;', t);
    execute format(
      'create policy anon_all on %I for all to anon using (true) with check (true);', t
    );
  end loop;
end $$;
