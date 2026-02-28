/**
 * Wyciąganie fragmentów kodu z plików .py.
 *
 * Format fragmentId:
 * - "1" (linia 1), "10-25" (linie 10–25), "all" lub puste = cały plik (linie 1-based).
 */

export function getFragmentFromPy(fullText: string, fragmentId: string): string {
  const trimmed = fragmentId.trim()
  if (!trimmed || trimmed.toLowerCase() === 'all') {
    return fullText
  }
  const lines = fullText.split(/\r?\n/)
  const single = /^\d+$/.exec(trimmed)
  if (single) {
    const lineNum = parseInt(single[0], 10)
    if (lineNum < 1 || lineNum > lines.length) return ''
    return lines[lineNum - 1] ?? ''
  }
  const range = /^(\d+)-(\d+)$/.exec(trimmed)
  if (range) {
    const start = Math.max(1, parseInt(range[1], 10))
    const end = Math.min(lines.length, parseInt(range[2], 10))
    if (start > end) return ''
    return lines.slice(start - 1, end).join('\n')
  }
  return fullText
}
