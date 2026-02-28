/** Nazwy miesięcy po polsku (Styczeń = indeks 0). */
export const MONTH_NAMES_PL: string[] = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
]

/** Opcje miesięcy do komponentów Select (value: 1–12, label: nazwa). */
export const MONTHS_SELECT_OPTIONS = MONTH_NAMES_PL.map((label, i) => ({
  value: i + 1,
  label,
}))
