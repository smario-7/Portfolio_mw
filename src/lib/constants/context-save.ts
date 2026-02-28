/** Opóźnienie (ms) przed zapisem content do backendu po zmianie stanu – ogranicza liczbę zapisów przy szybkiej edycji. */
export const CONTENT_SAVE_DEBOUNCE_MS = 500

/** Maksymalny czas (ms) oczekiwania na załadowanie danych kontekstu (content + projects) przed pokazaniem błędu timeout. */
export const LOAD_TIMEOUT_MS = 20000

/** Interwał (ms) sprawdzania timeoutu sesji przy braku aktywności użytkownika. */
export const SESSION_CHECK_INTERVAL_MS = 60000

/** Liczba lat wstecz w selekcie roku ukończenia kursu (zakładka O mnie). */
export const ABOUT_COURSES_YEARS_SPAN = 25

/** Tablica lat do wyboru w formularzu kursów (generowana raz przy imporcie modułu). */
export const COURSE_YEARS: number[] = Array.from(
  { length: ABOUT_COURSES_YEARS_SPAN },
  (_, i) =>
    new Date().getFullYear() - (ABOUT_COURSES_YEARS_SPAN - 1) + i
)
