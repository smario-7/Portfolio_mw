-- Naprawa 403 na POST page_views: upewnij się, że anon może robić insert.
-- Uruchom w Supabase → SQL Editor, jeśli licznik odwiedzin zwraca 403.

drop policy if exists "Anon insert page_views" on public.page_views;
create policy "Anon insert page_views"
  on public.page_views for insert
  to anon
  with check (true);
