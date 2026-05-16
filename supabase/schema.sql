create table if not exists user_problems (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  problem_id integer not null,
  status text not null default 'Not Started',
  last_attempted timestamptz,
  notes text default '',
  approach text default '',
  time_complexity text default '',
  space_complexity text default '',
  key_pattern text default '',
  mistakes text default '',
  solve_time_minutes integer,
  review_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, problem_id)
);
