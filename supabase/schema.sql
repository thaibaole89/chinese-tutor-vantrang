-- Chinese Tutor Bao — Supabase schema
-- Run in Supabase SQL editor when you're ready to move off localStorage.

create extension if not exists "pgcrypto";

-- ---------- profiles ----------
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  native_language text not null default 'vi',
  target_language text not null default 'zh',
  current_level text not null,
  goals jsonb not null default '[]'::jsonb,
  daily_study_time text not null,
  interests jsonb not null default '[]'::jsonb,
  learning_method jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------- lessons ----------
create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  week int not null,
  day int not null,
  title_zh text not null,
  title_vi text not null,
  objective_vi text not null,
  duration_minutes int not null default 20,
  content jsonb not null,
  created_at timestamptz not null default now(),
  unique (week, day)
);

-- ---------- flashcards ----------
create table if not exists flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  hanzi text not null,
  pinyin text not null,
  vietnamese_meaning text not null,
  synonyms jsonb not null default '[]'::jsonb,
  example_zh text,
  example_vi text,
  tags jsonb not null default '[]'::jsonb,
  frequency_level text not null default 'medium',
  review_status text not null default 'new',
  next_review_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists flashcards_user_idx on flashcards(user_id);

-- ---------- mistakes ----------
create table if not exists mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  original_sentence text not null,
  corrected_sentence text not null,
  pinyin text,
  explanation_vi text,
  better_version text,
  error_types jsonb not null default '[]'::jsonb,
  context text,
  review_count int not null default 0,
  mastered boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists mistakes_user_idx on mistakes(user_id);

-- ---------- quiz_results ----------
create table if not exists quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete set null,
  score int not null,
  total int not null,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists quiz_results_user_idx on quiz_results(user_id);

-- ---------- progress ----------
create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade unique,
  lessons_completed int not null default 0,
  total_vocabulary int not null default 0,
  mastered_vocabulary int not null default 0,
  quiz_average numeric not null default 0,
  streak int not null default 0,
  speaking_practice_count int not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------- RLS (uncomment when you wire Supabase auth) ----------
-- alter table profiles enable row level security;
-- alter table flashcards enable row level security;
-- alter table mistakes enable row level security;
-- alter table quiz_results enable row level security;
-- alter table progress enable row level security;
--
-- create policy "own profile" on profiles for select using (auth.uid() = id);
-- create policy "own flashcards" on flashcards for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- create policy "own mistakes" on mistakes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- create policy "own quiz" on quiz_results for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- create policy "own progress" on progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
