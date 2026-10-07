-- Admin = konto z flagą is_admin w app_metadata (JWT). app_metadata może zmienić tylko
-- administrator projektu (SQL Editor / Dashboard), użytkownik nie edytuje go sam
-- (w przeciwieństwie do user_metadata).

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- Nadanie uprawnień (wykonaj ręcznie, wstaw swój adres; konto musi już istnieć,
-- czyli zaloguj się wcześniej raz przez Google):
--
--   update auth.users
--   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"is_admin": true}'
--   where email = 'TWOJ_EMAIL@gmail.com';
--
-- Sprawdzenie:
--   select email, raw_app_meta_data from auth.users;
--
-- Po nadaniu flagi wyloguj się i zaloguj ponownie (flaga trafia do nowego tokenu).
-- Cofnięcie: ... || '{"is_admin": false}' (działa po wygaśnięciu tokenu, domyślnie do 1 h).
