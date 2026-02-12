# Plan migracji: Next.js → React (Vite + React Router)

## Etap 0: Przygotowanie (przed zmianami w kodzie)

1. **Backup / branch**  
   - Zrób branch w repo, np. `git checkout -b migrate-to-react`, albo lokalną kopię projektu.

2. **Lista plików do zmiany (do odhaczenia)**  
   - `app/layout.tsx` – layout główny, fonty, metadata  
   - `app/page.tsx` – Link  
   - `app/projects/page.tsx` – Link  
   - `app/admin/login/page.tsx` – useRouter  
   - `app/admin/layout.tsx`, `app/admin/dashboard/layout.tsx`, `app/admin/content/layout.tsx` – zamiana na layouty w routerze  
   - `app/admin/dashboard/page.tsx`, `app/admin/about/page.tsx`, `app/admin/content/page.tsx`, `app/admin/media/page.tsx`, `app/admin/projects/page.tsx`, `app/admin/projects/new/page.tsx`, `app/admin/settings/page.tsx` – ewentualnie Link  
   - `components/navbar.tsx` – jeśli używa Link  
   - `components/admin/sidebar.tsx` – Link, usePathname  

3. **Ustalenie ścieżek (routing)**  
   - `/` → strona główna (obecny `app/page.tsx`)  
   - `/projects` → lista projektów  
   - `/admin` → przekierowanie na `/admin/login` lub dashboard (do ustalenia)  
   - `/admin/login`  
   - `/admin/dashboard`, `/admin/about`, `/admin/content`, `/admin/media`, `/admin/projects`, `/admin/projects/new`, `/admin/settings`  

---

## Etap 1: Nowy szkielet Vite + React + TypeScript

1. W **głównym katalogu projektu** (albo w podkatalogu, jeśli wolisz migrację „obok”):
   - Zainicjować projekt Vite: `npm create vite@latest . -- --template react-ts` (albo nowy folder i potem skopiować do obecnego).
   - Jeśli inicjujesz w tym samym katalogu co Next.js, wcześniej usuń lub tymczasowo przenieś `node_modules`, `package.json` (albo zrób to w kopii repo).

2. **Zależności do dołożenia** (w nowym `package.json`):
   - `react-router-dom` (routing),
   - `@supabase/supabase-js` (jeśli od razu podpinasz Supabase),
   - Zachować wszystkie obecne zależności z obecnego `package.json` (Radix, Tailwind, shadcn, react-hook-form, zod, lucide-react, itd.) – najlepiej skopiować `dependencies` z obecnego projektu do nowego i dodać tylko `react-router-dom` i ewentualnie Supabase.

3. **Konfiguracja**:
   - **`vite.config.ts`**: ustawić `resolve.alias` tak jak w Next (`@/` → `src/` lub odpowiedni katalog), żeby importy `@/components/...` itd. działały. Dla GitHub Pages dodać później `base: '/nazwa-repo/'` (można w Etapie 6).
   - **Tailwind + PostCSS**: skopiować `tailwind.config.*`, `postcss.config.mjs` i `app/globals.css` (jako np. `src/index.css`), upewnić się, że Vite go importuje w `main.tsx`.
   - **`tsconfig.json`**: włączyć `"baseUrl"` i `"paths"` dla `@/*`, żeby TypeScript rozumiał aliasy.

---

## Etap 2: Struktura katalogów i przeniesienie kodu (bez zmiany logiki)

1. **Struktura katalogów** (np. pod `src/`):
   - `src/
     - components/` (cała zawartość obecnego `components/`)
     - `lib/`
     - `hooks/`
     - `app/` lub `pages/` (komponenty stron – obecne `app/**/page.tsx`)
     - `layouts/` (opcjonalnie – layouty wyciągnięte z `app/*/layout.tsx`)
     - `main.tsx`, `App.tsx`
   - W razie migracji „w miejscu” (bez nowego repo): zostawić `app/` jako folder ze stronami, a w `App.tsx` tylko zmapować je na trasy.

2. **Skopiować bez zmiany** (na ten moment):
   - `components/` → `src/components/` (albo bez `src/` jeśli nie używasz),
   - `lib/` → `src/lib/`,
   - `hooks/` → `src/hooks/`,
   - `app/globals.css` → `src/index.css` (albo `src/globals.css`) i podłączyć w `main.tsx`,
   - publiczne assety (ikony, obrazy) – do `public/` w Vite.

3. **Strony**:
   - Każdy `app/.../page.tsx` potraktować jako komponent do jednej trasy; można je zostawić w `app/` i tylko importować w routerze, albo przenieść do `src/pages/` i zmienić nazwy (np. `HomePage.tsx`, `ProjectsPage.tsx`, `AdminLoginPage.tsx` itd.) – ważne, żeby jedna strona = jeden komponent.

---

## Etap 3: Zamiana importów Next.js na React Router i usunięcie „use client“

W każdym pliku, gdzie występują:

1. **`import Link from 'next/link'`**  
   - Zamienić na: `import { Link } from 'react-router-dom'`.  
   - Atrybut `href` zamienić na `to`, np. `<Link to="/admin/dashboard">`.

2. **`import { useRouter } from 'next/navigation'`**  
   - Zamienić na: `import { useNavigate } from 'react-router-dom'`.  
   - `useRouter()` → `useNavigate()`, `router.push('/ścieżka')` → `navigate('/ścieżka')`.  
   - Plik: `app/admin/login/page.tsx`.

3. **`import { usePathname } from 'next/navigation'`**  
   - Zamienić na: `import { useLocation } from 'react-router-dom'`.  
   - `usePathname()` → `useLocation()`, `pathname` → `location.pathname`.  
   - Plik: `components/admin/sidebar.tsx` (aktywne linki po `location.pathname`).

4. **`'use client'`**  
   - Usunąć z góry wszystkich plików (w Vite nie ma Server Components).

5. **Fonty (obecnie w `app/layout.tsx`)**  
   - Usunąć import i użycie `Geist`, `Geist_Mono` z `next/font/google`.  
   - Dodać fonty w `index.html` (np. link do Google Fonts) albo przez `@fontsource` i zaimportować w `index.css`; w layoutach/body zostawić te same klasy (np. `font-sans`), żeby wygląd się nie zmienił.

6. **Metadata z `app/layout.tsx`**  
   - Przenieść tytuł i podstawowe meta do `index.html`.  
   - Opcjonalnie: `react-helmet-async` przy zmianie tytułu per strona (można dodać w późniejszym etapie).

Lista plików do przejścia (z Twojego projektu):  
`app/layout.tsx`, `app/page.tsx`, `app/projects/page.tsx`, `app/admin/login/page.tsx`, `components/admin/sidebar.tsx`, `app/admin/projects/page.tsx`, `app/admin/projects/new/page.tsx`, ewentualnie `components/navbar.tsx` (jeśli ma Link).

---

## Etap 4: Router i layouty

1. **Jeden plik z definicją tras** (np. `src/App.tsx` lub `src/routes.tsx`):
   - Import `BrowserRouter`, `Routes`, `Route`, `Navigate` z `react-router-dom`.
   - Import komponentów stron (obecne `app/.../page.tsx` lub ich kopie w `pages/`).

2. **Mapowanie tras** (przykład; ścieżki dopasuj do swoich):
   - `/` → komponent z `app/page.tsx`,
   - `/projects` → komponent z `app/projects/page.tsx`,
   - `/admin` → `<Navigate to="/admin/login" replace />` albo `/admin/dashboard` (zgodnie z logiką),
   - `/admin/login` → `app/admin/login/page.tsx`,
   - `/admin/dashboard` → dashboard,
   - `/admin/about`, `/admin/content`, `/admin/media`, `/admin/projects`, `/admin/projects/new`, `/admin/settings` → odpowiednie strony.

3. **Layouty**:
   - **Główny layout**: odpowiednik `app/layout.tsx` – wrapper wokół treści (np. w App.tsx jedna wspólna obudowa z nawigacją + `<Outlet />` dla zagnieżdżonych tras). `html`/`body` są w `index.html`.
   - **Admin layout**: Route z `path="/admin"` i `element={<AdminLayout />}` z `<Outlet />` wewnątrz; pod-routes: `path="login"`, `path="dashboard"`, itd.
   - Dashboard i content mają swoje layouty – można je wstawić jako nested routes pod `/admin`.

4. **Nawigacja w sidebarze**  
   - Upewnić się, że linki używają `to="/admin/..."` i że aktywny styl jest po `location.pathname` (już w Etapie 3).

---

## Etap 5: Punkt wejścia (index.html, main.tsx, App)

1. **`index.html`** (w root projektu dla Vite):
   - `<div id="root"></div>`, link do fontów (jeśli z Google Fonts), `<title>` i podstawowe `<meta>` (skopiowane z metadata z layoutu).

2. **`main.tsx`** (lub `main.jsx`):
   - Import `index.css` (globals),
   - `ReactDOM.createRoot(document.getElementById('root')).render(<App />)` (lub `<StrictMode><App /></StrictMode>`),
   - App importuje router i wszystkie potrzebne providery (np. theme provider).

3. **`App.tsx`**:
   - `<BrowserRouter>` (lub `<HashRouter>` dla GitHub Pages, jeśli są problemy z 404),
   - wewnątrz: `<Routes>` + wszystkie `<Route>` z Etapu 4,
   - ewentualnie ThemeProvider / inne providery z obecnego projektu.

4. **ThemeProvider i inne „client” providery**  
   - Przenieść z obecnego layoutu/komponentów do `App.tsx` (owrapować drzewo tak jak w Next).

---

## Etap 6: Usunięcie Next.js i dopieszczenie konfiguracji

1. **Usunąć**:
   - `next.config.mjs`,
   - zależność `next` z `package.json`,
   - w `tsconfig.json` / `next-env.d.ts` – referencje do Next i typy `next/image` itd.; zostawić tylko typy pod Vite + React.

2. **`package.json`**:
   - Skrypty: `"dev": "vite"`, `"build": "tsc && vite build"`, `"preview": "vite preview"`.
   - Usunąć skrypty Next (`next dev`, `next build`, `next start`).

3. **Ścieżki i aliasy**:
   - Sprawdzić, że wszystkie importy `@/components/...`, `@/lib/...` działają (Vite + TypeScript paths).

4. **GitHub Pages** (jeśli od razu deploy tam):
   - W `vite.config.ts` ustawić `base: '/nazwa-repo/'` (z końcowym slashem).
   - W razie problemów z 404 przy odświeżaniu: rozważyć `HashRouter` zamiast `BrowserRouter` (wtedy URL typu `...#/admin`).

5. **`pnpm install`** (lub `npm install`), `pnpm run build` – naprawić ewentualne błędy TypeScript i brakujące importy.

---

## Etap 7: Testy i poprawki

1. **Uruchomienie**: `pnpm run dev` – przejście ręcznie: `/`, `/projects`, `/admin/login`, `/admin/dashboard`, pozostałe podstrony admina, linki w sidebarze i navbarze.
2. **Sprawdzenie**: fonty, kolory, responsywność (Tailwind), formularze w panelu (np. content), nawigacja wstecz (scroll restoration – domyślnie React Router 6 ma `ScrollRestoration`; można dodać z `react-router-dom`).
3. **Build**: `pnpm run build` i `pnpm run preview` – sprawdzenie wersji produkcyjnej.
4. **Ewentualne poprawki**: 404 na GitHub Pages (base path, HashRouter), brakujące obrazy (ścieżki z `public/`), błędy w konsoli.

---

## Krótka checklista na koniec sesji

- [ ] Vite + React + TS działają, `pnpm run dev` i `pnpm run build` przechodzą.
- [ ] Wszystkie trasy z listy (/, /projects, /admin/*) działają.
- [ ] Żadnych importów z `next/`; `'use client'` usunięte.
- [ ] Link i nawigacja (useNavigate, useLocation) tylko z `react-router-dom`.
- [ ] Fonty i style jak wcześniej; layouty (root + admin) działają.
- [ ] `base` ustawione pod GitHub Pages (jeśli deploy tam).
- [ ] Build bez błędów, podgląd produkcyjny sprawdzony.