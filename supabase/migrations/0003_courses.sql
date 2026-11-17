-- Platform with several courses: access per course, waitlists for coming-soon courses,
-- and a log of update e-mails so the same update is never mailed twice.

alter table public.purchases add column if not exists course_key text not null default 'bgu-physics-3';

create table if not exists public.course_access (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_key text not null,
  granted_at timestamptz not null default now(),
  primary key (user_id, course_key)
);
alter table public.course_access enable row level security;
drop policy if exists "read own course access" on public.course_access;
create policy "read own course access" on public.course_access for select using (auth.uid() = user_id);

-- everyone who already bought Physics 3
insert into public.course_access (user_id, course_key, granted_at)
select id, 'bgu-physics-3', coalesce(access_granted_at, now()) from public.profiles where has_access
on conflict do nothing;

create table if not exists public.waitlist (
  id bigserial primary key,
  email text not null,
  course_key text not null,
  created_at timestamptz not null default now(),
  unique (email, course_key)
);
alter table public.waitlist enable row level security; -- no policies: only the server (service role) reads and writes

create table if not exists public.update_mailings (
  course_key text not null,
  update_id text not null,
  recipients integer not null default 0,
  sent_at timestamptz not null default now(),
  primary key (course_key, update_id)
);
alter table public.update_mailings enable row level security;
