import { useMemo } from 'react'
import { format, parseISO, addDays, differenceInDays } from 'date-fns'
import { pl } from 'date-fns/locale'
import type { ChartDataPoint } from '@/components/admin/dashboard/types'
import type { PageViewRecord } from '@/lib/services/page-views-service'

function aggregateByDay(records: PageViewRecord[]): ChartDataPoint[] {
  const byDay = new Map<string, number>()
  for (const r of records) {
    const d = format(parseISO(r.viewed_at), 'yyyy-MM-dd')
    byDay.set(d, (byDay.get(d) ?? 0) + 1)
  }
  const dates = [...byDay.keys()].sort((a, b) => a.localeCompare(b))
  if (dates.length === 0) return []
  const start = parseISO(dates[0])
  const end = parseISO(dates[dates.length - 1])
  const days = differenceInDays(end, start) + 1
  const result: ChartDataPoint[] = []
  for (let i = 0; i < days; i++) {
    const d = addDays(start, i)
    const date = format(d, 'yyyy-MM-dd')
    const timeMs = d.getTime()
    const count = byDay.get(date) ?? 0
    result.push({
      date,
      time: date,
      timeMs: Number.isNaN(timeMs) ? 0 : timeMs,
      count,
      full: format(d, 'd MMM yyyy', { locale: pl }),
    })
  }
  return result
}

export function useVisitsChartData(records: PageViewRecord[] | null): ChartDataPoint[] {
  return useMemo(() => {
    if (!records?.length) return []
    return aggregateByDay(records)
  }, [records])
}
