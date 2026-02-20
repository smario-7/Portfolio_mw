-- Polityka RLS: authenticated może usuwać wiadomości kontaktowe (panel admina).

create policy "authenticated_can_delete_contact_messages"
  on public.contact_messages
  for delete
  to authenticated
  using (true);
