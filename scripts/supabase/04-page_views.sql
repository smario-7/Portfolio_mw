-- Tabela page_views do licznika odwiedzin (anon rejestruje wizytę, authenticated czyta statystyki)

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  viewed_at timestamptz default now(),
  page text default 'home'
);

alter table public.page_views enable row level security;

create policy "Anon insert page_views"
  on public.page_views for insert
  to anon
  with check (true);

create policy "Authenticated read page_views"
  on public.page_views for select
  to authenticated
  using (true);

create index if not exists page_views_viewed_at_desc
  on public.page_views (viewed_at desc);
