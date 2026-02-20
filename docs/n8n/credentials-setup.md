# Instrukcje konfiguracji credentials w n8n

Ten dokument opisuje jak skonfigurować wymagane credentials (połączenia) w n8n dla workflow przetwarzania formularza kontaktowego.

## Wymagane credentials

1. **Supabase Service Role Key** - do odczytu i aktualizacji danych w Supabase
2. **Gmail App Password** - do wysyłki emaili przez Gmail SMTP

## 1. Supabase Service Role Key

### Lokalizacja klucza w Supabase

1. Otwórz [Supabase Dashboard](https://app.supabase.com)
2. Wybierz swój projekt
3. Przejdź do **Settings** → **API**
4. W sekcji **Project API keys** znajdziesz:
   - **anon public** - klucz publiczny (NIE używaj tego!)
   - **service_role** - klucz prywatny (użyj tego!)

5. Kliknij ikonę oka obok **service_role** aby pokazać klucz
6. Skopiuj cały klucz (zaczyna się od `eyJ...`)

**UWAGA:** Service Role Key omija Row Level Security (RLS) i ma pełny dostęp do bazy danych. Przechowuj go bezpiecznie i NIE commituj do repozytorium!

### Dodanie credentials w n8n

1. Otwórz n8n
2. Przejdź do **Credentials** (w menu głównym)
3. Kliknij **Add Credential**
4. Wyszukaj i wybierz **Supabase**
5. Wypełnij formularz:
   - **Credential Name:** `Supabase Service Role` (lub inna nazwa)
   - **Project URL:** `https://[PROJECT_REF].supabase.co`
     - `[PROJECT_REF]` znajdziesz w Supabase Dashboard → Settings → API → Project URL
     - Przykład: `https://abcdefghijklmnop.supabase.co`
   - **Service Role Key:** Wklej skopiowany Service Role Key
6. Kliknij **Save**

### Weryfikacja

Po zapisaniu credentials, możesz je przetestować:
1. Utwórz nowy workflow
2. Dodaj węzeł **Supabase** → **Execute Query**
3. Wybierz utworzone credentials
4. Wpisz prosty query: `SELECT 1 as test`
5. Uruchom workflow - powinien zwrócić wynik

### Bezpieczeństwo

- **NIE commituj** Service Role Key do repozytorium Git
- Przechowuj credentials w n8n (są szyfrowane)
- Jeśli używasz Docker, możesz użyć zmiennych środowiskowych:
  ```bash
  docker run -e SUPABASE_SERVICE_ROLE_KEY=your_key ...
  ```
- Regularnie rotuj klucze (co 3-6 miesięcy)

## 2. Gmail App Password

### Wymagania wstępne

Aby użyć Gmail App Password, musisz mieć włączoną **2-Step Verification** (dwuskładnikową weryfikację) w swoim koncie Google.

### Włączanie 2-Step Verification

1. Otwórz [Google Account](https://myaccount.google.com/)
2. Przejdź do **Security** (Bezpieczeństwo)
3. W sekcji **How you sign in to Google** znajdź **2-Step Verification**
4. Kliknij **Get started** i postępuj zgodnie z instrukcjami
5. Potwierdź numer telefonu i włącz 2-Step Verification

### Tworzenie App Password

1. W [Google Account](https://myaccount.google.com/) → **Security**
2. W sekcji **How you sign in to Google** znajdź **App passwords** (Hasła aplikacji)
   - Jeśli nie widzisz tej opcji, upewnij się że masz włączoną 2-Step Verification
3. Kliknij **App passwords**
4. Może być wymagane ponowne zalogowanie
5. W formularzu:
   - **Select app:** Wybierz **Mail**
   - **Select device:** Wybierz **Other (Custom name)**
   - **Enter name:** Wpisz `n8n` (lub inną nazwę)
6. Kliknij **Generate**
7. **Skopiuj wygenerowane hasło** (16 znaków, format: `xxxx xxxx xxxx xxxx`)
   - Usuń spacje: `xxxxxxxxxxxxxxxx`
   - To hasło będzie widoczne tylko raz!

### Dodanie credentials w n8n - Opcja A: Gmail węzeł

Jeśli n8n ma natywny węzeł Gmail:

1. W n8n → **Credentials** → **Add Credential**
2. Wybierz **Gmail**
3. Wybierz metodę autoryzacji: **App Password**
4. Wypełnij:
   - **Email:** Twój adres Gmail (np. `twoj@gmail.com`)
   - **Password:** Wklej App Password (16 znaków bez spacji)
5. Kliknij **Save**

### Dodanie credentials w n8n - Opcja B: SMTP (uniwersalne)

Jeśli n8n nie ma natywnego węzła Gmail lub wolisz użyć SMTP:

1. W n8n → **Credentials** → **Add Credential**
2. Wybierz **SMTP**
3. Wypełnij formularz:
   - **Credential Name:** `Gmail SMTP` (lub inna nazwa)
   - **Host:** `smtp.gmail.com`
   - **Port:** `465` (SSL) lub `587` (TLS)
   - **User:** Twój adres Gmail (np. `twoj@gmail.com`)
   - **Password:** Wklej App Password (16 znaków bez spacji)
   - **Secure:** `true` (SSL/TLS)
   - **Allow Self-Signed Certificates:** `false`
4. Kliknij **Save**

### Weryfikacja

Po zapisaniu credentials, możesz je przetestować:
1. Utwórz nowy workflow
2. Dodaj węzeł **Gmail** → **Send Email** (lub **SMTP** → **Send Email**)
3. Wybierz utworzone credentials
4. Wypełnij:
   - **To:** Twój adres email (do testu)
   - **Subject:** `Test email z n8n`
   - **Body:** `To jest testowa wiadomość`
5. Uruchom workflow
6. Sprawdź czy otrzymałeś email

### Rozwiązywanie problemów

**Problem: "Invalid credentials"**
- Upewnij się że używasz App Password, a nie zwykłego hasła Gmail
- Sprawdź czy skopiowałeś całe hasło (16 znaków)
- Upewnij się że usunąłeś spacje z hasła

**Problem: "Connection timeout"**
- Sprawdź czy port jest poprawny (465 dla SSL, 587 dla TLS)
- Sprawdź czy firewall nie blokuje połączenia
- Spróbuj użyć portu 587 z TLS zamiast 465 z SSL

**Problem: "Less secure app access"**
- App Passwords nie wymagają "Less secure app access"
- Jeśli widzisz ten komunikat, używasz zwykłego hasła zamiast App Password

**Problem: "2-Step Verification required"**
- Upewnij się że masz włączoną 2-Step Verification
- Bez tego nie możesz utworzyć App Password

### Bezpieczeństwo

- **NIE commituj** App Password do repozytorium Git
- App Password jest bezpieczniejsze niż zwykłe hasło - możesz je usunąć bez zmiany głównego hasła
- Jeśli podejrzewasz że App Password zostało skompromitowane:
  1. Przejdź do Google Account → Security → App passwords
  2. Znajdź hasło dla `n8n`
  3. Kliknij ikonę kosza aby je usunąć
  4. Utwórz nowe App Password
  5. Zaktualizuj credentials w n8n

### Limity Gmail

- **Darmowe konto Gmail:** 500 emaili dziennie
- **Google Workspace:** 2000 emaili dziennie (dla podstawowego planu)
- Jeśli przekroczysz limit, Gmail zablokuje wysyłkę na 24 godziny

## Podsumowanie

Po skonfigurowaniu obu credentials, możesz używać ich w workflow n8n:

1. **Supabase Service Role** - do odczytu `contact_messages` i `admin_settings`, oraz aktualizacji `contact_messages`
2. **Gmail SMTP** - do wysyłki emaili do właściciela i potwierdzeń do nadawców

Wszystkie credentials są przechowywane w n8n w zaszyfrowanej formie i są dostępne tylko dla użytkowników z odpowiednimi uprawnieniami.
