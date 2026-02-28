import type { IpynbCell, IpynbCellSummary, IpynbNotebook, IpynbOutput } from './types'

const LABEL_MAX_LENGTH = 80

const IMAGE_MIME_KEYS = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'] as const

function normalizeCellSource(cell: IpynbCell): string {
  const raw = cell.source
  if (Array.isArray(raw)) return raw.join('')
  if (typeof raw === 'string') return raw
  return ''
}

function outputHasImageData(output: IpynbOutput): boolean {
  if (output.output_type !== 'display_data' && output.output_type !== 'execute_result') {
    return false
  }
  const data = output.data
  if (!data || typeof data !== 'object') return false
  return IMAGE_MIME_KEYS.some((key) => data[key] !== undefined)
}

function cellHasImageOutput(cell: IpynbCell): boolean {
  if (cell.cell_type !== 'code') return false
  const outputs = cell.outputs
  if (!Array.isArray(outputs)) return false
  return outputs.some(outputHasImageData)
}

function buildLabel(cell: IpynbCell): string {
  if (cellHasImageOutput(cell)) return 'obraz'
  const text = normalizeCellSource(cell)
  const oneLine = text.replace(/\r?\n/g, ' ').trim()
  if (oneLine.length <= LABEL_MAX_LENGTH) return oneLine
  return oneLine.slice(0, LABEL_MAX_LENGTH) + '…'
}

export function getIpynbCellSummaries(rawJson: string): IpynbCellSummary[] {
  let data: IpynbNotebook
  try {
    data = JSON.parse(rawJson) as IpynbNotebook
  } catch {
    return []
  }
  const cells = data.cells ?? []
  return cells.map((cell, index) => ({
    index,
    label: buildLabel(cell),
  }))
}
