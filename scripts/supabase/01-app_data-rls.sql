-- Etap 1: tabela app_data i RLS (Supabase SQL Editor)

create table if not exists public.app_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table public.app_data enable row level security;

create policy "Public read app_data"
  on public.app_data for select
  to anon, authenticated
  using (true);

create policy "Authenticated write app_data"
  on public.app_data for all
  to authenticated
  using (true)
  with check (true);
