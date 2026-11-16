-- Physics 3 learning app: users, purchases, progress.
-- Run once in Supabase: SQL Editor -> paste this whole file -> Run.

-- 1. profiles: one row per user. has_access is set only by the payment webhook (service role).
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  has_access boolean not null default false,
  access_granted_at timestamptz,
  created_at timestamptz not null default now()
);

-- 2. purchases: the server creates a pending row before redirecting to Morning; the webhook marks it paid.
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(10,2) not null,
  currency text not null default 'ILS',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  payment_url text,
  morning_document_id text unique,
  raw_notify jsonb,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index if not exists purchases_user_idx on public.purchases(user_id);

-- 3. progress: which cards and exercises a user marked as understood / solved.
create table if not exists public.progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

-- Row Level Security: users read their own rows; only the server (service role) writes profiles and purchases.
alter table public.profiles enable row level security;
alter table public.purchases enable row level security;
alter table public.progress enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "purchases: read own" on public.purchases;
create policy "purchases: read own" on public.purchases
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "progress: read own" on public.progress;
create policy "progress: read own" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "progress: add own" on public.progress;
create policy "progress: add own" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "progress: remove own" on public.progress;
create policy "progress: remove own" on public.progress
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Create a profile automatically for every new user.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email) on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for users who signed up before this migration.
insert into public.profiles (id, email) select id, email from auth.users on conflict (id) do nothing;
