-- Etap 1: polityki Storage dla bucketa project-files (Supabase SQL Editor)
-- Najpierw utwórz bucket: Storage → New bucket → nazwa "project-files", Public bucket = włączone
-- Potem uruchom ten skrypt w SQL Editor

-- Odczyt: wszyscy
create policy "Public read project-files"
  on storage.objects for select
  to public
  using (bucket_id = 'project-files');

-- Upload: tylko zalogowani
create policy "Authenticated upload project-files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-files');

-- Usuwanie: tylko zalogowani
create policy "Authenticated delete project-files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-files');
