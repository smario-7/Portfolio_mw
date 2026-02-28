import { describe, it, expect } from 'vitest'
import {
  getIpynbCellSummaries,
  filterIpynbByCellIndices,
  type IpynbNotebook,
} from './index'

describe('getIpynbCellSummaries', () => {
  it('returns empty array for invalid JSON', () => {
    expect(getIpynbCellSummaries('not json')).toEqual([])
  })

  it('returns empty array for empty notebook or missing cells', () => {
    expect(getIpynbCellSummaries(JSON.stringify({}))).toEqual([])
    expect(getIpynbCellSummaries(JSON.stringify({ cells: [] }))).toEqual([])
  })

  it('returns summaries for markdown and code cells with text label', () => {
    const raw = JSON.stringify({
      cells: [
        { cell_type: 'markdown', source: ['# Title\n', 'Intro text'] },
        { cell_type: 'code', source: ['x = 1\n', 'print(x)'] },
      ],
    })
    const summaries = getIpynbCellSummaries(raw)
    expect(summaries).toHaveLength(2)
    expect(summaries[0]).toEqual({ index: 0, label: '# Title Intro text' })
    expect(summaries[1]).toEqual({ index: 1, label: 'x = 1 print(x)' })
  })

  it('returns "obraz" for code cell with image output', () => {
    const raw = JSON.stringify({
      cells: [
        {
          cell_type: 'code',
          source: ['import matplotlib; matplotlib.pyplot.plot([1,2])'],
          outputs: [
            {
              output_type: 'display_data',
              data: { 'image/png': 'base64data' },
            },
          ],
        },
      ],
    })
    const summaries = getIpynbCellSummaries(raw)
    expect(summaries).toHaveLength(1)
    expect(summaries[0]).toEqual({ index: 0, label: 'obraz' })
  })

  it('returns "obraz" for execute_result with image', () => {
    const raw = JSON.stringify({
      cells: [
        {
          cell_type: 'code',
          source: ['fig'],
          outputs: [
            { output_type: 'execute_result', data: { 'image/jpeg': 'x' } },
          ],
        },
      ],
    })
    const summaries = getIpynbCellSummaries(raw)
    expect(summaries[0].label).toBe('obraz')
  })

  it('truncates long content with ellipsis', () => {
    const long = 'a'.repeat(100)
    const raw = JSON.stringify({ cells: [{ cell_type: 'code', source: [long] }] })
    const summaries = getIpynbCellSummaries(raw)
    expect(summaries[0].label).toHaveLength(81)
    expect(summaries[0].label.endsWith('…')).toBe(true)
  })
})

describe('filterIpynbByCellIndices', () => {
  const sampleNotebook: IpynbNotebook = {
    nbformat: 4,
    nbformat_minor: 2,
    cells: [
      { cell_type: 'markdown', source: ['A'] },
      { cell_type: 'code', source: ['B'] },
      { cell_type: 'code', source: ['C'] },
      { cell_type: 'markdown', source: ['D'] },
    ],
  }

  it('returns notebook with only cells 0 and 2 for fragmentId "0,2"', () => {
    const result = filterIpynbByCellIndices(sampleNotebook, '0,2')
    expect(result.cells).toHaveLength(2)
    expect((result.cells![0] as { source?: string[] }).source).toEqual(['A'])
    expect((result.cells![1] as { source?: string[] }).source).toEqual(['C'])
  })

  it('returns notebook with cells 1 and 2 for fragmentId "1-2"', () => {
    const result = filterIpynbByCellIndices(sampleNotebook, '1-2')
    expect(result.cells).toHaveLength(2)
    expect((result.cells![0] as { source?: string[] }).source).toEqual(['B'])
    expect((result.cells![1] as { source?: string[] }).source).toEqual(['C'])
  })

  it('returns all cells for empty fragmentId', () => {
    const result = filterIpynbByCellIndices(sampleNotebook, '')
    expect(result.cells).toHaveLength(4)
  })

  it('preserves metadata and nbformat', () => {
    const result = filterIpynbByCellIndices(sampleNotebook, '0')
    expect(result.nbformat).toBe(4)
    expect(result.nbformat_minor).toBe(2)
  })

  it('returns notebook with single cell for fragmentId "0"', () => {
    const result = filterIpynbByCellIndices(sampleNotebook, '0')
    expect(result.cells).toHaveLength(1)
    expect((result.cells![0] as { source?: string[] }).source).toEqual(['A'])
  })

  it('ignores out-of-range indices and returns only valid cells', () => {
    const result = filterIpynbByCellIndices(sampleNotebook, '0,10')
    expect(result.cells).toHaveLength(1)
    expect((result.cells![0] as { source?: string[] }).source).toEqual(['A'])
  })
})
