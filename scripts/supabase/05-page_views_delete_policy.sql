-- Polityka RLS: authenticated może usuwać wpisy page_views (do resetu / usuwania pojedynczych rekordów).

create policy "Authenticated delete page_views"
  on public.page_views for delete
  to authenticated
  using (true);
