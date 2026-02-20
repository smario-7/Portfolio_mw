import { format, parseISO, differenceInDays } from 'date-fns'
import { pl } from 'date-fns/locale'
import { MAX_X_LABELS } from './visits-chart-constants'

export function getDaySpan(
  startDateStr: string | undefined,
  endDateStr: string | undefined
): number {
  if (!startDateStr || !endDateStr) return 0
  try {
    return Math.max(0, differenceInDays(parseISO(endDateStr), parseISO(startDateStr)))
  } catch {
    return 0
  }
}

export function formatTimeAxisLabel(dateStr: string, daySpan: number): string {
  const date = parseISO(dateStr)
  if (daySpan > 60) {
    return format(date, 'MMM yyyy', { locale: pl })
  }
  if (daySpan > 14) {
    return format(date, 'd MMM', { locale: pl })
  }
  return format(date, 'd MMM yyyy', { locale: pl })
}

export function getXAxisInterval(visibleCount: number): number {
  if (visibleCount <= 0) return 0
  return Math.max(0, Math.floor(visibleCount / MAX_X_LABELS))
}
