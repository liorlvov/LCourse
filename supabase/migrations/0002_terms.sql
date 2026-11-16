-- Record which version of the terms each buyer accepted, and when.
alter table public.purchases add column if not exists terms_version text;
alter table public.purchases add column if not exists terms_accepted_at timestamptz;
