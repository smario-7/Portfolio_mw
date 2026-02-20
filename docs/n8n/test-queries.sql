-- Skrypty SQL do testowania workflow n8n
-- Uruchom te zapytania w Supabase SQL Editor przed testowaniem workflow

-- ============================================
-- TEST 1: Przygotowanie danych testowych
-- ============================================

-- 1.1. Sprawdź czy istnieje rekord w admin_settings
SELECT * FROM public.admin_settings;

-- 1.2. Jeśli nie ma rekordu, utwórz testowy (wymaga zalogowania jako authenticated user)
-- UWAGA: To zapytanie musi być wykonane przez zalogowanego użytkownika w aplikacji,
-- lub przez Service Role Key w n8n. W SQL Editor możesz użyć:
INSERT INTO public.admin_settings (user_id, email, name)
VALUES (
  auth.uid(), -- używa ID zalogowanego użytkownika
  'twoj-email@gmail.com', -- ZMIEŃ na swój email
  'Twoje Imię' -- ZMIEŃ na swoją nazwę
)
ON CONFLICT (user_id) DO UPDATE
SET email = EXCLUDED.email,
    name = EXCLUDED.name;

-- 1.3. Utwórz testową wiadomość kontaktową
INSERT INTO public.contact_messages (name, email, message, processed)
VALUES (
  'Test User',
  'test@example.com', -- ZMIEŃ na prawdziwy email jeśli chcesz otrzymać potwierdzenie
  'To jest testowa wiadomość z formularza kontaktowego. Sprawdzam czy workflow n8n działa poprawnie.',
  FALSE
);

-- ============================================
-- TEST 2: Sprawdzenie nieprzetworzonych wiadomości
-- ============================================

-- 2.1. Pobierz wszystkie nieprzetworzone wiadomości (to samo zapytanie używa n8n)
SELECT 
  id,
  name,
  email,
  message,
  created_at,
  processed,
  processed_at
FROM public.contact_messages
WHERE processed = FALSE
ORDER BY created_at ASC
LIMIT 10;

-- 2.2. Policz nieprzetworzone wiadomości
SELECT COUNT(*) as unprocessed_count
FROM public.contact_messages
WHERE processed = FALSE;

-- ============================================
-- TEST 3: Sprawdzenie ustawień właściciela
-- ============================================

-- 3.1. Pobierz ustawienia właściciela (to samo zapytanie używa n8n)
SELECT 
  email,
  name
FROM public.admin_settings
LIMIT 1;

-- 3.2. Sprawdź czy email jest poprawny
SELECT 
  email,
  name,
  CASE 
    WHEN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' 
    THEN 'Valid' 
    ELSE 'Invalid' 
  END as email_status
FROM public.admin_settings
LIMIT 1;

-- ============================================
-- TEST 4: Symulacja przetwarzania wiadomości
-- ============================================

-- 4.1. Oznacz wiadomość jako przetworzoną (ręcznie, do testów)
UPDATE public.contact_messages
SET processed = TRUE,
    processed_at = NOW()
WHERE id = 'PASTE_MESSAGE_ID_HERE'; -- ZMIEŃ na ID wiadomości

-- 4.2. Sprawdź przetworzone wiadomości
SELECT 
  id,
  name,
  email,
  created_at,
  processed_at,
  EXTRACT(EPOCH FROM (processed_at - created_at)) / 60 as processing_time_minutes
FROM public.contact_messages
WHERE processed = TRUE
ORDER BY processed_at DESC
LIMIT 10;

-- ============================================
-- TEST 5: Czyszczenie danych testowych
-- ============================================

-- 5.1. Usuń wszystkie testowe wiadomości (UWAGA: usuwa wszystkie!)
-- DELETE FROM public.contact_messages WHERE email = 'test@example.com';

-- 5.2. Resetuj wiadomość do stanu nieprzetworzonego (do ponownego testu)
UPDATE public.contact_messages
SET processed = FALSE,
    processed_at = NULL
WHERE id = 'PASTE_MESSAGE_ID_HERE'; -- ZMIEŃ na ID wiadomości

-- ============================================
-- TEST 6: Test z wieloma wiadomościami
-- ============================================

-- 6.1. Utwórz kilka testowych wiadomości jednocześnie
INSERT INTO public.contact_messages (name, email, message, processed)
VALUES 
  ('Jan Kowalski', 'jan@example.com', 'Pierwsza testowa wiadomość', FALSE),
  ('Anna Nowak', 'anna@example.com', 'Druga testowa wiadomość', FALSE),
  ('Piotr Wiśniewski', 'piotr@example.com', 'Trzecia testowa wiadomość', FALSE),
  ('Maria Zielińska', 'maria@example.com', 'Czwarta testowa wiadomość', FALSE),
  ('Tomasz Lewandowski', 'tomasz@example.com', 'Piąta testowa wiadomość', FALSE);

-- 6.2. Sprawdź ile wiadomości jest nieprzetworzonych
SELECT COUNT(*) as unprocessed_count
FROM public.contact_messages
WHERE processed = FALSE;

-- ============================================
-- TEST 7: Test obsługi błędów - brak ustawień
-- ============================================

-- 7.1. Tymczasowo usuń ustawienia właściciela (do testu)
-- UWAGA: Zapisz dane przed usunięciem!
-- DELETE FROM public.admin_settings WHERE user_id = auth.uid();

-- 7.2. Po teście przywróć ustawienia:
-- INSERT INTO public.admin_settings (user_id, email, name)
-- VALUES (auth.uid(), 'twoj-email@gmail.com', 'Twoje Imię');

-- ============================================
-- TEST 8: Statystyki przetwarzania
-- ============================================

-- 8.1. Statystyki dzienne
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_messages,
  COUNT(*) FILTER (WHERE processed = TRUE) as processed_messages,
  COUNT(*) FILTER (WHERE processed = FALSE) as unprocessed_messages,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE processed = TRUE) / COUNT(*),
    2
  ) as processing_rate_percent
FROM public.contact_messages
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- 8.2. Średni czas przetwarzania
SELECT 
  AVG(EXTRACT(EPOCH FROM (processed_at - created_at)) / 60) as avg_processing_time_minutes,
  MIN(EXTRACT(EPOCH FROM (processed_at - created_at)) / 60) as min_processing_time_minutes,
  MAX(EXTRACT(EPOCH FROM (processed_at - created_at)) / 60) as max_processing_time_minutes
FROM public.contact_messages
WHERE processed = TRUE
  AND processed_at IS NOT NULL
  AND created_at >= NOW() - INTERVAL '7 days';

-- ============================================
-- TEST 9: Walidacja danych
-- ============================================

-- 9.1. Sprawdź wiadomości z nieprawidłowymi danymi (powinny być zablokowane przez constraints)
-- Te zapytania powinny zwrócić błąd:

-- Zbyt krótkie imię (mniej niż 2 znaki)
-- INSERT INTO public.contact_messages (name, email, message, processed)
-- VALUES ('A', 'test@example.com', 'Test message', FALSE);

-- Nieprawidłowy format emaila
-- INSERT INTO public.contact_messages (name, email, message, processed)
-- VALUES ('Test User', 'nieprawidlowy-email', 'Test message', FALSE);

-- Zbyt krótka wiadomość (mniej niż 10 znaków)
-- INSERT INTO public.contact_messages (name, email, message, processed)
-- VALUES ('Test User', 'test@example.com', 'Krótka', FALSE);

-- ============================================
-- TEST 10: Rate limiting (opcjonalnie)
-- ============================================

-- 10.1. Sprawdź ile wiadomości z danego emaila w ostatniej godzinie
SELECT 
  email,
  COUNT(*) as messages_count,
  MAX(created_at) as last_message_time
FROM public.contact_messages
WHERE email = 'test@example.com' -- ZMIEŃ na testowy email
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY email;

-- 10.2. Funkcja do sprawdzania rate limit (utwórz w Supabase)
-- CREATE OR REPLACE FUNCTION check_rate_limit(p_email TEXT)
-- RETURNS BOOLEAN AS $$
-- DECLARE
--   v_count INTEGER;
-- BEGIN
--   SELECT COUNT(*) INTO v_count
--   FROM contact_messages
--   WHERE email = p_email
--     AND created_at > NOW() - INTERVAL '1 hour';
--   
--   RETURN v_count < 5; -- max 5 wiadomości na godzinę
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10.3. Test funkcji rate limit
-- SELECT check_rate_limit('test@example.com');

-- ============================================
-- INSTRUKCJE UŻYCIA
-- ============================================

-- 1. Przed pierwszym testem:
--    - Uruchom zapytania z sekcji TEST 1 (przygotowanie danych)
--    - Upewnij się że masz poprawny email w admin_settings

-- 2. Przed testowaniem workflow:
--    - Uruchom TEST 2.1 aby sprawdzić czy są nieprzetworzone wiadomości
--    - Uruchom TEST 3.1 aby sprawdzić czy ustawienia właściciela są poprawne

-- 3. Po uruchomieniu workflow:
--    - Uruchom TEST 4.2 aby sprawdzić czy wiadomości zostały przetworzone
--    - Sprawdź czy otrzymałeś emaile

-- 4. Do czyszczenia po testach:
--    - Użyj zapytań z sekcji TEST 5

-- 5. Do monitorowania:
--    - Użyj zapytań z sekcji TEST 8 (statystyki)
