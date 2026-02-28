import type { IpynbNotebook } from './types'

function parseFragmentIdToIndices(fragmentId: string, cellsLength: number): number[] {
  const trimmed = fragmentId.trim()
  if (!trimmed) {
    return Array.from({ length: cellsLength }, (_, i) => i)
  }
  const indices: number[] = []
  for (const part of trimmed.split(',')) {
    const range = /^(\d+)-(\d+)$/.exec(part.trim())
    if (range) {
      const a = parseInt(range[1], 10)
      const b = parseInt(range[2], 10)
      for (let i = Math.max(0, a); i <= Math.min(cellsLength - 1, b); i++) {
        indices.push(i)
      }
    } else {
      const num = parseInt(part.trim(), 10)
      if (!Number.isNaN(num) && num >= 0 && num < cellsLength) {
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
  return ordered
}

export function filterIpynbByCellIndices(
  ipynbJson: IpynbNotebook,
  fragmentId: string
): IpynbNotebook {
  const cells = ipynbJson.cells ?? []
  const indices = parseFragmentIdToIndices(fragmentId, cells.length)
  const selectedCells = indices.map((i) => cells[i]!).filter(Boolean)
  return { ...ipynbJson, cells: selectedCells }
}
