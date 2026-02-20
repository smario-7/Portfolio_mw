-- Kolumna color może brakować w starszych instalacjach. Uruchom tylko jeśli potrzebne.
-- W standardowej definicji (03-projects-table.sql) kolumna color jest już zawarta.

alter table public.projects
  add column if not exists color text;
