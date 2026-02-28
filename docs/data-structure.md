# Struktura bazy danych Supabase

Opis tabel, kolumn, RLS, Storage oraz funkcji i triggerów w bazie Supabase używanej w projekcie. Źródło definicji: skrypty w `scripts/supabase/`, typy TypeScript generowane poleceniem `npm run gen:supabase-types` do `src/lib/supabase/database.types.ts`.

Schemat: **public**.

---

## 1. Tabele

### 1.1 app_data

Przechowuje dane w formacie klucz–wartość (JSON). Używane m.in. pod kluczem `content` dla edytowalnej treści strony (ContentData: home, about, contact).

| Kolumna    | Typ        | Ograniczenia        | Opis |
|------------|------------|---------------------|------|
| key        | text       | PRIMARY KEY         | Klucz rekordu (np. `content`) |
| value      | jsonb      | NOT NULL            | Wartość (dowolny JSON) |
| updated_at | timestamptz| DEFAULT now()       | Ostatnia aktualizacja |

**RLS:** odczyt (SELECT) dla `anon` i `authenticated`; zapis (INSERT/UPDATE/DELETE) tylko dla `authenticated`. Skrypt: `01-app_data-rls.sql`.

---

### 1.2 projects

Projekty portfolio. Lista wyświetlana na stronie i w panelu admin; mapowanie na typ `Project` w aplikacji.

| Kolumna         | Typ        | Ograniczenia        | Opis |
|-----------------|------------|---------------------|------|
| id              | bigint     | GENERATED ALWAYS AS IDENTITY, PRIMARY KEY | Identyfikator |
| title           | text       | NOT NULL, default '' | Tytuł |
| description     | text       | NOT NULL, default '' | Krótki opis |
| category        | text       | NOT NULL, CHECK (Frontend/Backend/AI/Analiza Danych/Full Stack) | Kategoria |
| stack           | jsonb      | NOT NULL, default '[]' | Lista technologii |
| image           | text       | —                   | Ścieżka do obrazka |
| github          | text       | NOT NULL, default '' | Link do repozytorium |
| demo            | text       | NOT NULL, default '' | Link do demo |
| color           | text       | —                   | Np. klasy Tailwind do gradientu |
| order           | int        | NOT NULL, default 0 | Kolejność wyświetlania |
| full_description| jsonb      | NOT NULL, default '[]' | Rozszerzony opis (bloki treści) |
| attachments     | jsonb      | NOT NULL, default '[]' | Lista załączników wyświetlana na tablecie; w panelu admin użytkownik wybiera je z puli plików projektu w Storage (rozszerzenia .pdf, .ipynb, .md, .py) i ustala kolejność wyświetlania. |
| download_links  | jsonb      | —                   | Nieużywane w UI ani przy zapisie z panelu admin; kolumna zachowana dla kompatybilności wstecznej. |
| status         | text       | default 'draft', CHECK (draft/published) | Status publikacji |
| featured       | boolean    | default false       | Czy wyróżniony |
| created_at     | timestamptz| default now()       | Data utworzenia |
| updated_at     | timestamptz| default now()       | Aktualizowany przez trigger |

**RLS:** odczyt dla `anon` i `authenticated`; zapis (INSERT/UPDATE/DELETE) tylko dla `authenticated`. Skrypt: `03-projects-table.sql`. Trigger `projects_updated_at` ustawia `updated_at = now()` przy UPDATE.

---

### 1.3 page_views

Licznik odwiedzin. Anonim rejestruje wizytę (INSERT), zalogowany admin czyta statystyki (SELECT) i może usuwać (DELETE).

| Kolumna  | Typ        | Ograniczenia        | Opis |
|----------|------------|---------------------|------|
| id       | bigint     | GENERATED ALWAYS AS IDENTITY, PRIMARY KEY | Identyfikator |
| viewed_at| timestamptz| default now()       | Czas wizyty |
| page     | text       | default 'home'      | Identyfikator strony |

Indeks: `page_views_viewed_at_desc` na `(viewed_at DESC)`.

**RLS:** INSERT tylko `anon`; SELECT i DELETE tylko `authenticated`. Skrypty: `04-page_views.sql`, `04a-page_views-anon-insert-fix.sql`, `04b-page_views-authenticated-delete.sql` / `05-page_views_delete_policy.sql`.

---

### 1.4 contact_messages

Wiadomości z formularza kontaktowego. Anonim wstawia (INSERT) z formularza publicznego; zalogowany admin może też wstawiać (np. testowanie formularza), czytać, aktualizować (np. oznaczenie jako przetworzone) i usuwać.

| Kolumna     | Typ        | Ograniczenia        | Opis |
|-------------|------------|---------------------|------|
| id          | uuid       | PRIMARY KEY, default gen_random_uuid() | Identyfikator |
| name        | text       | NOT NULL            | Imię/nazwa (2–100 znaków) |
| email       | text       | NOT NULL            | Adres e-mail (regex) |
| message     | text       | NOT NULL            | Treść (10–2000 znaków) |
| created_at  | timestamptz| NOT NULL, default now() | Data wysłania |
| processed   | boolean    | NOT NULL, default false | Czy oznaczono jako przetworzone |
| processed_at| timestamptz| —                   | Kiedy oznaczono |

Ograniczenia: `check_name_length`, `check_email_format`, `check_message_length`. Indeks: `idx_contact_messages_processed` na `(processed, created_at)`.

**RLS:** INSERT dla `anon` i `authenticated`; SELECT, UPDATE, DELETE tylko `authenticated`. Skrypty: `06-contact_messages.sql`, `06a-contact_messages_delete_policy.sql`, `06b-contact_messages_authenticated_insert.sql`. Trigger `contact_messages_rate_limit`: ten sam adres e-mail nie może wysłać wiadomości w ciągu 30 minut (funkcja `check_contact_rate_limit`). Skrypt: `08-contact_messages_rate_limit.sql`.

---

### 1.5 admin_settings

Ustawienia zalogowanego użytkownika (jeden wiersz na użytkownika). Wymaga Supabase Auth (`auth.users`).

| Kolumna    | Typ        | Ograniczenia        | Opis |
|------------|------------|---------------------|------|
| id         | uuid       | PRIMARY KEY, default gen_random_uuid() | Identyfikator |
| user_id    | uuid       | REFERENCES auth.users(id) ON DELETE CASCADE, UNIQUE | Użytkownik |
| email      | text       | NOT NULL            | E-mail (regex) |
| name       | text       | NOT NULL            | Nazwa (2–100 znaków) |
| created_at | timestamptz| NOT NULL, default now() | Data utworzenia |
| updated_at | timestamptz| NOT NULL, default now() | Aktualizowany przez trigger |

**RLS:** SELECT, INSERT, UPDATE tylko dla `authenticated` i tylko na własnym wierszu (`auth.uid() = user_id`). Skrypt: `07-admin_settings.sql`. Trigger `trigger_update_admin_settings_updated_at` ustawia `updated_at = now()` przy UPDATE.

---

## 2. Podsumowanie RLS

| Tabela           | anon      | authenticated |
|------------------|-----------|----------------|
| app_data         | SELECT    | SELECT, INSERT, UPDATE, DELETE |
| projects         | SELECT    | SELECT, INSERT, UPDATE, DELETE |
| page_views       | INSERT    | SELECT, DELETE |
| contact_messages | INSERT    | SELECT, INSERT, UPDATE, DELETE |
| admin_settings   | —         | SELECT, INSERT, UPDATE tylko własny wiersz |

---

## 3. Storage

Bucket **project-files** (publiczny): pliki projektów (załączniki, screeny), ścieżki typu `projects/{id}/...`.

- **Odczyt:** wszyscy (public).
- **Upload (INSERT):** tylko `authenticated`.
- **Usuwanie (DELETE):** tylko `authenticated`.

Szczegóły: `scripts/supabase/02-storage-policies.sql`. Bucket tworzony ręcznie w dashboardzie Supabase (Storage → New bucket → nazwa `project-files`, Public bucket włączone).

---

## 4. Funkcje i triggery

- **projects_updated_at** — trigger BEFORE UPDATE na `projects`; ustawia `updated_at := now()`.
- **update_admin_settings_updated_at** — trigger BEFORE UPDATE na `admin_settings`; ustawia `updated_at := now()`.
- **check_contact_rate_limit(p_email)** — funkcja: zwraca true, jeśli adres `p_email` nie wysłał wiadomości w ostatnich 30 minut.
- **trigger_contact_rate_limit** — trigger BEFORE INSERT na `contact_messages`; wywołuje `check_contact_rate_limit` i rzuca wyjątek przy przekroczeniu limitu.

---

## 5. Zależności

- **admin_settings.user_id** → **auth.users(id)** ON DELETE CASCADE. Pozostałe tabele w `public` nie mają kluczy obcych do innych tabel aplikacji.

---

## 6. Kolejność wdrażania skryptów

1. `01-app_data-rls.sql`
2. Utworzenie bucketu `project-files` w dashboardzie
3. `02-storage-policies.sql`
4. `03-projects-table.sql`
5. `04-page_views.sql` (opcjonalnie `04a-`, `04b-` / `05-` przy problemach z politykami)
6. `06-contact_messages.sql`, `06a-contact_messages_delete_policy.sql`, `06b-contact_messages_authenticated_insert.sql`, `08-contact_messages_rate_limit.sql`
7. `07-admin_settings.sql` (wymaga włączonego Auth)

Opcjonalnie (migracje / uzupełnienia): `03b-migrate-projects-from-app_data.sql` (jednorazowa migracja z app_data), `03c-add-color-if-missing.sql` (dodanie kolumny `color`, gdy brakuje w starszej instalacji).

Szczegóły Etapu 1 (app_data, bucket, storage): `scripts/supabase/README.md`.

---

## 7. Mapowanie na aplikację

| Źródło w bazie / Storage      | Użycie w aplikacji |
|------------------------------|---------------------|
| app_data (key = `content`)   | Treść strony (ContentData: home, about, contact). Typy i pola: `src/lib/types/content.ts`, widoki: HomeSection, AboutSection, ContactSection, panel admin – zakładki treści. |
| projects                     | Lista projektów (Project[]). Widoki: ProjectsSection, ProjectCard, ProjectDetail, tabela projektów w panelu admin. Załączniki w widoku tabletu pochodzą z `project.attachments`; w adminie użytkownik wybiera je z listy plików w bucketcie (pula) i ustala kolejność. |
| contact_messages            | Wiadomości z formularza. Panel admin: sekcja wiadomości kontaktowych. |
| page_views                   | Statystyki odwiedzin. Panel admin: dashboard, reset licznika. |
| admin_settings               | Ustawienia zalogowanego użytkownika (email, name). |
| Storage bucket project-files | Obrazki i załączniki projektów; URL-e budowane w `src/lib/utils/storage-url.ts`. |

Szczegółowy opis pól ContentData i Project oraz mapowanie danych na komponenty (katalogi, ikony, filtry) – typy w `src/lib/types/`, dane domyślne w `src/lib/data/`.

Bloki kodu w pełnym opisie projektu (`full_description`, typ `code`): dla `sourceType: 'py'` fragment kodu wyciągany przez `src/lib/parsers/code-fragment.ts` i wyświetlany w CodeBlock (syntax highlight). Dla `sourceType: 'ipynb'` notebook jest renderowany przez **react-ipynb-renderer**; podsumowania komórek i filtrowanie po indeksach w `src/lib/parsers/ipynb/` (getIpynbCellSummaries, filterIpynbByCellIndices); komponent widoku w `src/components/project-detail/code-block/` (IpynbBlockRenderer). Pole `fragmentId` określa wybrane indeksy komórek (0-based), np. `0,2,4` lub `1-3`; puste `fragmentId` oznacza wszystkie komórki.
