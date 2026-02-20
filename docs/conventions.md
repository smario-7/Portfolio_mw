# Konwencje projektu (Etap 0 refaktoryzacji)

Konwencje przyjęte na Etap 0 refaktoryzacji; stosować w etapach 1–8.

---

## 1. Nazewnictwo plików i folderów

| Element | Konwencja | Przykłady |
|--------|-----------|-----------|
| **Pliki komponentów React** | **PascalCase** | `ProjectCard.tsx`, `ContactRateLimitModal.tsx`, `TabletScene.tsx` |
| **Foldery domenowe** | **kebab-case** | `project-detail/`, `projects-zoom/`, `contact-messages/` |
| **Pliki hooków** | **kebab-case** | `use-project-form.ts`, `use-toast.ts` |
| **Lib – pliki utilit / API / stałe** | **kebab-case** lub **camelCase** | `storage-url.ts`, `format-relative-date.ts`, `page-views-api.ts` |
| **Lib – pliki typów** (w `lib/types/`) | **kebab-case** | `contact-message.ts`, `admin-settings.ts`, `project.ts` |

Jeden wariant dla komponentów (PascalCase) w całym projekcie; foldery i pliki niekomponentowe pozostają w kebab-case dla spójności z obecnym stanem i z przyjętą konwencją w wielu projektach.

---

## 2. Komentarze w kodzie

- **Zostawić:** komentarze tłumaczące **„dlaczego”** lub nietrywialne **„jak”** (np. animacje, perspektywa tabletu, portale).
- **Usunąć:** komentarze oczywiste (np. „close dialog”), instrukcje typu „tu coś zmienić”.
- **Logi:** tymczasowe `console.log` w DEV – usunąć lub zastąpić warunkowym debugiem (np. za flagą lub w trybie dev).
- **JSDoc:** tylko przy **eksportowanym API** – funkcje w `lib/`, hooki w `hooks/`; tylko tam, gdzie zachowanie nie wynika wprost z nazwy.

Te zasady stosować we wszystkich etapach refaktoryzacji (2–8) przy przeglądzie i dodawaniu komentarzy.
