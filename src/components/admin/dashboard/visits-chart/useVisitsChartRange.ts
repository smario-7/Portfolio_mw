import { useState, useCallback, useEffect } from 'react'
import type { ChartDataPoint } from '@/components/admin/dashboard/types'
import { ZOOM_FACTOR, MIN_VISIBLE_POINTS } from './visits-chart-constants'

export interface ChartRange {
  startIndex: number
  endIndex: number
}

function clampRange(
  startIndex: number,
  endIndex: number,
  dataLength: number
): ChartRange {
  const minSpan = dataLength > 0 ? Math.min(MIN_VISIBLE_POINTS, dataLength) : 1
  const span = Math.max(minSpan, endIndex - startIndex)
  const start = Math.max(0, Math.min(startIndex, dataLength - span))
  const end = Math.min(dataLength, Math.max(endIndex, start + span))
  return { startIndex: start, endIndex: end }
}

export function useVisitsChartRange(data: ChartDataPoint[]) {
  const dataLength = data.length
  const [range, setRangeState] = useState<ChartRange>(() => ({
    startIndex: 0,
    endIndex: Math.max(1, dataLength),
  }))

  useEffect(() => {
    setRangeState((prev) => clampRange(prev.startIndex, prev.endIndex, dataLength))
  }, [dataLength])

  const setRange = useCallback(
    (next: ChartRange | ((prev: ChartRange) => ChartRange)) => {
      setRangeState((prev) => {
        const nextRange = typeof next === 'function' ? next(prev) : next
        return clampRange(
          nextRange.startIndex,
          nextRange.endIndex,
          dataLength
        )
      })
    },
    [dataLength]
  )

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (dataLength === 0) return
      const span = range.endIndex - range.startIndex
      const center = (range.startIndex + range.endIndex) / 2

      if (e.shiftKey) {
        const delta = Math.round((e.deltaY > 0 ? 1 : -1) * Math.max(1, span * 0.1))
        const newStart = Math.max(0, range.startIndex + delta)
        const newEnd = Math.min(dataLength, range.endIndex + delta)
        if (newEnd - newStart >= MIN_VISIBLE_POINTS) {
          setRange({ startIndex: newStart, endIndex: newEnd })
        }
        e.preventDefault()
        return
      }

      const factor = e.deltaY > 0 ? 1 + ZOOM_FACTOR : 1 - ZOOM_FACTOR
      let newSpan = Math.round(span * factor)
      const minSpan = Math.min(MIN_VISIBLE_POINTS, dataLength)
      newSpan = Math.max(minSpan, Math.min(dataLength, newSpan))
      let newStart = Math.round(center - newSpan / 2)
      let newEnd = newStart + newSpan
      if (newStart < 0) {
        newStart = 0
        newEnd = newSpan
      }
      if (newEnd > dataLength) {
        newEnd = dataLength
        newStart = dataLength - newSpan
      }
      setRange({ startIndex: newStart, endIndex: newEnd })
      e.preventDefault()
    },
    [dataLength, range.startIndex, range.endIndex, setRange]
  )

  return { range, setRange, handleWheel }
}
