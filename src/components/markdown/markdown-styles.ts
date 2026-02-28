/**
 * Klasa kontenera pełnego opisu – używana w index.css do stylów p:empty (puste linie) i ul/ol+p:empty.
 */
export const FULL_DESCRIPTION_MARKDOWN_CONTAINER = 'full-description-markdown'

/**
 * Stała klas używana przy renderowaniu pełnego opisu projektu.
 * Ten sam zestaw klas stosowany w podglądzie (admin) i na stronie projektu – identyczny wygląd.
 * white-space: normal zapewnia widoczność <br> i akapitów (np. na tablecie).
 */
export const FULL_DESCRIPTION_MARKDOWN_CLASS =
  `${FULL_DESCRIPTION_MARKDOWN_CONTAINER} text-lg leading-relaxed text-muted-foreground whitespace-normal`

export const LIST_UL_CLASS = 'list-disc list-inside pl-4 my-0 space-y-0'
export const LIST_OL_CLASS = 'list-decimal list-inside pl-4 my-0 space-y-0'
export const LIST_LI_CLASS = 'ml-2'
