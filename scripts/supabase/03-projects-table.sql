-- Tabela relacyjna projects (plan: Supabase relational DB and data layer, Etap 1)
-- Wymaga: 01-app_data-rls.sql (app_data) i 02-storage-policies.sql (bucket) już wykonane

create table if not exists public.projects (
  id bigint generated always as identity primary key,
  title text not null default '',
  description text not null default '',
  category text not null check (category in ('Frontend', 'Backend', 'AI', 'Analiza Danych', 'Full Stack')),
  stack jsonb not null default '[]',
  image text,
  github text not null default '',
  demo text not null default '',
  color text,
  "order" int not null default 0,
  full_description jsonb not null default '[]',
  attachments jsonb not null default '[]',
  download_links jsonb,
  status text default 'draft' check (status in ('draft', 'published')),
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;

create policy "Public read projects"
  on public.projects for select
  to anon, authenticated
  using (true);

create policy "Authenticated write projects"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

create or replace function public.projects_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger projects_updated_at
  before update on public.projects
  for each row
  execute function public.projects_updated_at();
