# Portfolio – Mariusz Wysogląd

Strona portfolio programisty z publiczną prezentacją projektów oraz panelem administracyjnym do zarządzania treścią, projektami, wiadomościami kontaktowymi i statystykami odwiedzin. 
Interfejs imituje tablet w perspektywie, z przewijaniem treści pod kątem. Projekty można powiększyć do pełnego ekranu dla wygodniejszego przeglądania.

## Funkcjonalności

**Strona publiczna**

- Sekcje: Home, O mnie, Projekty, Kontakt
- Projekty: lista, widok zoom, szczegóły z pełnym opisem (bloki tekstu, kodu, zrzuty ekranu), załączniki, linki do repozytorium i demo
- Formularz kontaktowy z limitem wysyłek i walidacją
- Motyw ciemny / jasny (z zapisem preferencji)

**Panel admina**

- Logowanie (Supabase Auth)
- Dashboard: wykres odwiedzin, liczniki
- Edycja treści stron (Home, O mnie, Kontakt) – dane w Supabase (`app_data`)
- CRUD projektów: kategorie, stack, obrazki, załączniki, pełny opis w blokach, status (szkic / opublikowany), kolejność
- Przeglądanie i oznaczanie wiadomości z formularza kontaktowego
- Ustawienia

**Obsługa wiadomości kontaktowych (n8n)**

Po zapisie wiadomości w Supabase workflow n8n wysyła: e-mail z informacją do admina, powiadomienie przez Telegram oraz e-mail z podziękowaniem za kontakt do nadawcy.

## Stos technologiczny

- **Frontend:** React 19, TypeScript, Vite 6, React Router 7, Tailwind CSS 4, Radix UI (komponenty w stylu shadcn), Lucide, Embla Carousel, react-markdown, Prism (podświetlanie kodu)
- **Backend i dane:** Supabase (Auth, PostgreSQL – tabele `app_data`, `projects`, `page_views`, `contact_messages`, `admin_settings`, Storage), opcjonalnie serwer Express (proxy `/api`)
- **Automatyzacja:** n8n – obsługa wiadomości z formularza (e-mail do admina, Telegram, e-mail z podziękowaniem do nadawcy)
- **Narzędzia:** ESLint, dotenv-cli (m.in. do generowania typów Supabase)

## Wymagania

- Node.js 18+
- Konto Supabase

## Uruchomienie

```bash
git clone <repo>
cd Portfolio_mw
npm install
```

Skopiuj `.env.example` do `.env` i uzupełnij:

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` – wymagane do działania aplikacji
- `SUPABASE_PROJECT_ID` – do generowania typów TypeScript z bazy (`npm run gen:supabase-types`)

```bash
npm run dev
```

Aplikacja działa w trybie deweloperskim (Vite z proxy na backend).

## Skrypty

| Polecenie | Opis |
|-----------|------|
| `npm run dev` | Serwer deweloperski z proxy na backend |
| `npm run build` | Build produkcyjny (TypeScript + Vite) |
| `npm run preview` | Podgląd zbudowanej wersji |
| `npm run lint` | ESLint |
| `npm run server` | Uruchomienie serwera Express |
| `npm run gen:supabase-types` | Generowanie typów z Supabase (wymaga `SUPABASE_PROJECT_ID` w `.env`) |
| `npm run test` | Testy jednostkowe (Vitest) |
| `npm run test:watch` | Testy jednostkowe w trybie watch |
| `npm run test:e2e` | Testy E2E (Playwright) – wymaga wcześniejszego wygenerowania sesji |
| `npm run test:e2e:auth` | Jednorazowe wygenerowanie sesji: otwiera logowanie, po ręcznym zalogowaniu przez Google zapisuje stan do `e2e/.auth/user.json` |

## Testy E2E

Test E2E pokrywa ścieżkę: edycja treści (content) → zapis → weryfikacja sukcesu. Logowanie odbywa się przez Google OAuth; test używa zapisanego stanu sesji (storageState).

**Wymagania:** Node.js 18+, działający `npm run dev` (Vite na `http://localhost:5173`), skonfigurowane Supabase (zapis contentu).

**Pierwsze uruchomienie:**

1. Zainstaluj przeglądarki Playwright: `npx playwright install` (lub `npx playwright install chromium`).
2. Uruchom aplikację w jednym terminalu: `npm run dev`.
3. W drugim terminalu wygeneruj stan sesji: `npm run test:e2e:auth`. Otworzy się przeglądarka – zaloguj się ręcznie przez Google na stronie logowania admina. Po przekierowaniu na dashboard stan zostanie zapisany w `e2e/.auth/user.json` (plik jest w `.gitignore`).
4. Uruchom testy E2E: `npm run test:e2e`.

Przy kolejnych uruchomieniach wystarczy `npm run test:e2e` (dev server uruchomi się automatycznie, jeśli nie działa). Sesja wygasa po czasie – w razie przekierowania na login uruchom ponownie `npm run test:e2e:auth`.

W CI test E2E można pomijać (np. gdy brak zapisanego stanu sesji) lub uruchamiać warunkowo po skonfigurowaniu środowiska testowego.

## Struktura projektu

- `src/pages/` – strony (Home, panel admina)
- `src/components/` – komponenty (portfolio, admin, project-detail, ui, shared)
- `src/contexts/` – konteksty (Portfolio, TabletModalContainer); ZoomLayoutContext w `src/components/portfolio/projects-zoom/`
- `src/lib/` – API, serwisy, repozytoria, typy, klient Supabase, obsługa błędów
- `docs/` – [data-structure.md](docs/data-structure.md) (baza, tabele, RLS), [conventions.md](docs/conventions.md) (konwencje), [architecture.md](docs/architecture.md) (warstwy, błędy, trasy)

## Deployment (GitHub Pages)

Build jest skonfigurowany pod base URL `/Portfolio_mw/` (vite.config.ts). W CI/CD (np. GitHub Actions) ustaw zmienne środowiskowe dla Supabase w sekcji Secrets and variables → Actions.

## Dokumentacja

- [docs/data-structure.md](docs/data-structure.md) – struktura bazy Supabase, tabele, RLS, Storage
- [docs/conventions.md](docs/conventions.md) – konwencje nazewnictwa i komentarzy w projekcie
- [docs/architecture.md](docs/architecture.md) – architektura warstw, obsługa błędów, ścieżki (routes)
