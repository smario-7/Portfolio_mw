-- Zezwól zalogowanym (admin) na usuwanie wpisów z page_views

create policy "Authenticated delete page_views"
  on public.page_views for delete
  to authenticated
  using (true);
