-- INSERT dla roli authenticated (np. gdy użytkownik jest zalogowany w panelu admina
-- i testuje formularz kontaktowy na stronie głównej)
create policy "authenticated_can_insert_contact_messages"
  on public.contact_messages
  for insert
  to authenticated
  with check (true);
