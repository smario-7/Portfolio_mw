# Struktura danych wyświetlanych na stronie

**Obowiązujący opis** danych i ich mapowania na widoki. Przy dodawaniu pól, zmianie typów lub powiązań komponentów należy trzymać się tej struktury i zaktualizować ten dokument.

Aplikacja opiera się na trzech głównych źródłach: **treści strony** (teksty, przyciski, umiejętności), **listy projektów** oraz **katalogach pomocniczych** (narzędzia, ikony kontaktów). Poniżej każda z tych grup jest opisana wraz z polami i miejscem użycia w widokach.

---

## 1. Wprowadzenie

Na stronie portfolio wyświetlane są:

- **ContentData** — treść sekcji: strona główna (hero, przyciski, nagłówki), sekcja „O mnie” (wprowadzenie, doświadczenie, umiejętności, kafelki, narzędzia) oraz sekcja kontakt (tytuł, opis, linki).
- **Projekty (Project[])** — lista projektów z opisami, stosem technologii, linkami do repozytorium i demo; używana na stronie projektów oraz w widoku szczegółów pojedynczego projektu.
- **Katalogi** — stałe zestawy danych: katalog narzędzi (ToolItem) do wyświetlania wybranych narzędzi w sekcji „O mnie” oraz mapowanie typów linków kontaktowych na nazwy ikon (contact-icons).

Dane treści i projekty są udostępniane przez funkcje w `src/lib/data/store.ts` (`getContent()`, `getProjects()`, `getProjectFilters()`, `getToolsCatalog()`). Domyślna treść strony pochodzi z `content-defaults.ts`, lista projektów z `projects.ts`.

---

## 2. Treść strony (ContentData)

Typ `ContentData` (plik `src/lib/types/content.ts`) grupuje całą edytowalną treść strony w trzy bloki: `home`, `about`, `contact`.

### 2.1 Sekcja Home (strona główna)

| Pole | Typ | Opis |
|------|-----|------|
| `heroTitle` | string | Główny tytuł w sekcji hero (np. „Cześć, jestem…”). |
| `heroSubtitle` | string | Podtytuł pod głównym tytułem. |
| `heroDescription` | string | Krótki opis pod tytułem. |
| `button1Text` | string | Tekst pierwszego przycisku (np. „Zobacz projekty”). |
| `button2Text` | string | Tekst drugiego przycisku (np. „Pobierz CV”). |
| `projectsTitle` | string | Tytuł sekcji projektów. |
| `projectsDescription` | string | Opis sekcji projektów. |
| `skills` | string[] | Lista umiejętności wyświetlanych na stronie głównej (np. etykiety). |

**Gdzie używane:** Pola sekcji Home są edytowane w panelu administracyjnym (zakładka treści – content-home-tab). Na stronie głównej komponent `HomeSection` korzysta z `content.home` jako źródła treści.

### 2.2 Sekcja About (O mnie)

| Pole | Typ | Opis |
|------|-----|------|
| `introduction` | string | Wstępny opis w sekcji „O mnie”. |
| `experience` | tablica obiektów | Lista wpisów doświadczenia. Każdy wpis ma: `year` (string), `title` (string), `description` (string). |
| `skills` | obiekt { [kategoria]: string[] } | Umiejętności pogrupowane w kategorie (np. „Frontend”, „Backend”). Klucz to nazwa kategorii, wartość to lista nazw umiejętności. |
| `tiles` | AboutTile[] (opcjonalne) | Kafelki z ikoną, tytułem i opisem (np. „Doświadczenie”, „Edukacja”, „Zainteresowania”). |
| `tools` | string[] (opcjonalne) | Lista identyfikatorów narzędzi odwołujących się do katalogu `TOOLS_CATALOG`; wyświetlane są tylko wybrane narzędzia. |

**Gdzie używane:** W panelu admin wszystkie te pola są edytowane (content-about-tab). Na stronie publicznej komponent `AboutSection` wyświetla: `tiles` (kafelki z ikonami), `skills` (umiejętności wg kategorii) oraz narzędzia z katalogu wskazane przez `tools`. Pola `introduction` i `experience` są używane w panelu admin i na stronie „O mnie” z `content.about`.

### 2.3 Sekcja Contact (Kontakt)

| Pole | Typ | Opis |
|------|-----|------|
| `title` | string | Tytuł sekcji kontakt (np. „Skontaktuj się”). |
| `description` | string | Krótki opis nad linkami/formularzem. |
| `email` | string | Adres e-mail (może być używany jako zapas, gdy brak `links`). |
| `phone` | string | Numer telefonu. |
| `github` | string | URL profilu GitHub. |
| `linkedin` | string | URL profilu LinkedIn. |
| `links` | ContactLink[] (opcjonalne) | Lista linków kontaktowych (e-mail, telefon, LinkedIn itd.) wyświetlana w sekcji „Bezpośrednie linki”. |

**Gdzie używane:** Komponent `ContactSection` korzysta z `title`, `description` oraz `links`. Dla każdego linku wyświetlana jest ikona (na podstawie `type` i mapowania w contact-icons), etykieta (np. z `label` lub domyślna dla danego typu) oraz wartość `value` (adres e-mail, numer, URL). Pola `email`, `phone`, `github`, `linkedin` są w strukturze danych i mogą być używane w panelu admin lub jako rezerwa.

---

## 3. Projekty (Project)

Projekty są opisane typem `Project` (plik `src/lib/types.ts`) i przechowywane jako tablica w `src/lib/data/projects.ts`.

### 3.1 Pola projektu

| Pole | Typ | Opis |
|------|-----|------|
| `id` | number | Unikalny identyfikator projektu. |
| `title` | string | Tytuł projektu. |
| `description` | string | Krótki opis (np. w karcie i na górze strony szczegółów). |
| `category` | ProjectCategory | Kategoria: „Frontend”, „Backend”, „AI” lub „Analiza Danych”. |
| `stack` | string[] | Lista technologii (wyświetlane jako etykiety/badże). |
| `image` | string (opcjonalne) | Ścieżka do obrazka projektu (np. `/projects/…`). |
| `github` | string | Link do repozytorium GitHub. |
| `demo` | string | Link do wersji demo. |
| `color` | string (opcjonalne) | Klasy Tailwind do gradientu (np. „from-blue-500 to-cyan-500”). |
| `fullDescription` | string (opcjonalne) | Rozszerzony opis wyświetlany na stronie szczegółów projektu. |

### 3.2 Kategorie i filtry

- **ProjectCategory** — jeden z: `'Frontend' | 'Backend' | 'AI' | 'Analiza Danych'`.
- **ProjectFilter** — `'Wszystkie'` lub jedna z kategorii. Lista filtrów do wyboru jest budowana dynamicznie przez `getProjectFilters()` na podstawie kategorii występujących w liście projektów (w pliku danych eksportowana jest też stała `PROJECT_FILTERS`).

**Gdzie używane:** Lista projektów i filtry — komponent `ProjectsSection` (pobiera projekty i filtry ze store’a), karty projektów — `ProjectCard` (tytuł, opis, stack, kolor, linki GitHub i demo). Widok szczegółów pojedynczego projektu — `ProjectDetail` (wszystkie pola, w tym `fullDescription` jeśli jest). Panel admin korzysta z tej samej listy projektów (np. tabela projektów).

---

## 4. Struktury pomocnicze

### 4.1 ContactLink i ContactLinkType

- **ContactLinkType** — typ linku: `'linkedin' | 'facebook' | 'instagram' | 'phone' | 'email'`.
- **ContactLink**:
  - `type` — ContactLinkType (określa ikonę i domyślną etykietę),
  - `label` (opcjonalne) — własna etykieta zamiast domyślnej,
  - `value` — wartość linku (adres e-mail, numer telefonu lub URL).

Ikony dla typów są zdefiniowane w `src/lib/data/contact-icons.ts` (mapowanie typ → nazwa ikony Lucide). Na stronie kontakt linki `email` i `phone` generują odpowiednio `mailto:` i `tel:`; pozostałe typy są traktowane jako zwykłe URL-e (np. LinkedIn, Facebook, Instagram).

### 4.2 AboutTile

Kafelek w sekcji „O mnie”:

- `id` — unikalny identyfikator (string),
- `title` — tytuł kafelka,
- `description` — krótki opis,
- `icon` (opcjonalne) — nazwa ikony z biblioteki Lucide (np. „Briefcase”, „GraduationCap”).

Komponent `AboutSection` wyświetla kafelki w siatce i mapuje `icon` na komponent ikony.

### 4.3 ToolItem (katalog narzędzi)

Element katalogu narzędzi (plik `src/lib/data/tools-catalog.ts`):

- `id` — identyfikator (np. „git”, „react”, „python”),
- `name` — nazwa wyświetlana (np. „Git”, „React”),
- `icon` — nazwa ikony Lucide (np. „GitBranch”, „Code2”).

Sekcja „O mnie” w `ContentData.about.tools` przechowuje listę takich `id`; wyświetlane są tylko te narzędzia z katalogu, których `id` znajduje się na tej liście. Katalog jest zwracany przez `getToolsCatalog()`.

---

## 5. Geometria (ekran tabletu)

Typy `Point`, `Quad` i `ScreenQuad` (plik `src/lib/types.ts`) nie opisują treści tekstowych, tylko geometrię obszaru ekranu tabletu na stronie:

- **Point** — `{ x: number, y: number }`.
- **Quad** — krotka czterech punktów `[Point, Point, Point, Point]`.
- **ScreenQuad** — obiekt z polami `p1`, `p2`, `p3`, `p4` (Point), reprezentujący cztery rogi ekranu tabletu.

Hook `useTabletScreenQuad` oblicza te współrzędne na podstawie elementów DOM i używa ich m.in. do ustalenia, czy zdarzenie scrollowania ma być przechwycone w obszarze tabletu. Nie wpływają one na treść wyświetlaną użytkownikowi w formie tekstu czy list.

---

## 6. Mapowanie: dane → widoki

Poniższa tabela wskazuje, która część danych jest używana w którym komponencie lub stronie.

| Dane | Gdzie używane |
|------|----------------|
| `content.home.*` | Panel admin: zakładka treści (content-home-tab). Strona główna: HomeSection (źródło: content.home). |
| `content.about.introduction`, `content.about.experience` | Panel admin: content-about-tab (edycja). |
| `content.about.skills` | Panel admin: content-about-tab. Strona: AboutSection (umiejętności wg kategorii). |
| `content.about.tiles` | Panel admin: content-about-tab. Strona: AboutSection (kafelki z ikonami). |
| `content.about.tools` | Panel admin: content-about-tab. Strona: AboutSection (wybór narzędzi z TOOLS_CATALOG). |
| `content.contact.*` | Panel admin: content-contact-tab. Strona: ContactSection (title, description, links). |
| `projects` (getProjects) | Strona: ProjectsSection, ProjectCard, ProjectDetail. Panel admin: np. tabela projektów. |
| `getProjectFilters()` | Strona: ProjectsSection (przyciski filtrów kategorii). |
| `getToolsCatalog()` | Strona: AboutSection (wyświetlanie narzędzi po id z content.about.tools). Panel admin: wybór narzędzi. |
| ContactLink + contact-icons | Strona: ContactSection (ikony i linki w sekcji „Bezpośrednie linki”). |

Dzięki temu wiesz, gdzie szukać w kodzie przy zmianie wyświetlania danej treści lub przy dodawaniu nowych pól do struktury danych.
