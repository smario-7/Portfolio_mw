/**
 * Wyciąganie fragmentów kodu z plików .py i .ipynb.
 *
 * Format fragmentId:
 * - .py: "1" (linia 1), "10-25" (linie 10–25), "all" lub puste = cały plik (linie 1-based).
 * - .ipynb: "0", "0,2", "1-3" = indeksy komórek (0-based).
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

interface JupyterCell {
  cell_type?: string
  source?: string[] | string
}

interface JupyterNotebook {
  cells?: JupyterCell[]
}

function normalizeCellSource(cell: JupyterCell): string {
  const raw = cell.source
  if (Array.isArray(raw)) return raw.join('')
  if (typeof raw === 'string') return raw
  return ''
}

export function getFragmentFromIpynb(rawJson: string, fragmentId: string): string {
  const trimmed = fragmentId.trim()
  let data: JupyterNotebook
  try {
    data = JSON.parse(rawJson) as JupyterNotebook
  } catch {
    return ''
  }
  const cells = data.cells ?? []
  if (!trimmed) {
    return cells.map(normalizeCellSource).join('\n\n')
  }
  const indices: number[] = []
  for (const part of trimmed.split(',')) {
    const range = /^(\d+)-(\d+)$/.exec(part.trim())
    if (range) {
      const a = parseInt(range[1], 10)
      const b = parseInt(range[2], 10)
      for (let i = Math.max(0, a); i <= Math.min(cells.length - 1, b); i++) {
        indices.push(i)
      }
    } else {
      const num = parseInt(part.trim(), 10)
      if (!Number.isNaN(num) && num >= 0 && num < cells.length) {
        indices.push(num)
      }
    }
  }
  const seen = new Set<number>()
  const ordered = indices.filter((i) => {
    if (seen.has(i)) return false
    seen.add(i)
    return true
  })
  ordered.sort((a, b) => a - b)
  return ordered.map((i) => normalizeCellSource(cells[i]!)).join('\n\n')
}
