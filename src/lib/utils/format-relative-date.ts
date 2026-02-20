/**
 * Formatuje datę ISO względem teraz: "dziś o 14:32", "wczoraj", "2 dni temu" itd.
 */
export function formatRelativeDate(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  if (sameDay) {
    const h = date.getHours().toString().padStart(2, '0')
    const m = date.getMinutes().toString().padStart(2, '0')
    return `dziś o ${h}:${m}`
  }
  if (diffDays === 1) return 'wczoraj'
  if (diffDays >= 2 && diffDays <= 6) return `${diffDays} dni temu`
  if (diffDays >= 7 && diffDays <= 13) return 'tydzień temu'
  if (diffDays >= 14 && diffDays <= 29) return '2 tygodnie temu'
  if (diffDays >= 30 && diffDays <= 59) return 'miesiąc temu'
  if (diffDays >= 60) return `${Math.floor(diffDays / 30)} mies. temu`
  return date.toLocaleDateString('pl-PL')
}
