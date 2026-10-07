-- Ogranicza zapis/odczyt panelu do kont z public.is_admin() (patrz 09-admin-claim.sql).
-- URUCHOM DOPIERO PO nadaniu flagi swojemu kontu i ponownym zalogowaniu,
-- inaczej stracisz dostęp do danych w panelu. Polityki dla anon zostają bez zmian.

-- app_data
drop policy if exists "Authenticated write app_data" on public.app_data;
create policy "Authenticated write app_data"
  on public.app_data for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- projects
drop policy if exists "Authenticated write projects" on public.projects;
create policy "Authenticated write projects"
  on public.projects for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- storage (bucket project-files)
drop policy if exists "Authenticated upload project-files" on storage.objects;
create policy "Authenticated upload project-files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-files' and public.is_admin());

drop policy if exists "Authenticated delete project-files" on storage.objects;
create policy "Authenticated delete project-files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-files' and public.is_admin());

-- page_views
drop policy if exists "Authenticated read page_views" on public.page_views;
create policy "Authenticated read page_views"
  on public.page_views for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Authenticated delete page_views" on public.page_views;
create policy "Authenticated delete page_views"
  on public.page_views for delete
  to authenticated
  using (public.is_admin());

-- contact_messages
drop policy if exists "authenticated_can_read_contact_messages" on public.contact_messages;
create policy "authenticated_can_read_contact_messages"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

drop policy if exists "authenticated_can_update_contact_messages" on public.contact_messages;
create policy "authenticated_can_update_contact_messages"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "authenticated_can_delete_contact_messages" on public.contact_messages;
create policy "authenticated_can_delete_contact_messages"
  on public.contact_messages for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "authenticated_can_insert_contact_messages" on public.contact_messages;
create policy "authenticated_can_insert_contact_messages"
  on public.contact_messages for insert
  to authenticated
  with check (public.is_admin());

-- admin_settings (własny wiersz + admin)
drop policy if exists "authenticated_can_read_own_settings" on public.admin_settings;
create policy "authenticated_can_read_own_settings"
  on public.admin_settings for select
  to authenticated
  using (auth.uid() = user_id and public.is_admin());

drop policy if exists "authenticated_can_insert_own_settings" on public.admin_settings;
create policy "authenticated_can_insert_own_settings"
  on public.admin_settings for insert
  to authenticated
  with check (auth.uid() = user_id and public.is_admin());

drop policy if exists "authenticated_can_update_own_settings" on public.admin_settings;
create policy "authenticated_can_update_own_settings"
  on public.admin_settings for update
  to authenticated
  using (auth.uid() = user_id and public.is_admin())
  with check (auth.uid() = user_id and public.is_admin());

-- Rollback: w każdym bloku wyżej przywróć poprzednie warunki
-- (using (true) / with check (true); admin_settings: auth.uid() = user_id; storage: tylko bucket_id)
-- zgodnie z plikami 01, 02, 03, 04, 04b, 06, 06a, 06b, 07.
