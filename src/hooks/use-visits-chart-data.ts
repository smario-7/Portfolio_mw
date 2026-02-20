import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { pl } from 'date-fns/locale'
import type { ChartDataPoint } from '@/components/admin/dashboard/types'
import type { PageViewRecord } from '@/lib/api/page-views-api'

function aggregateByDay(records: PageViewRecord[]): ChartDataPoint[] {
  const byDay = new Map<string, number>()
  for (const r of records) {
    const d = format(parseISO(r.viewed_at), 'yyyy-MM-dd')
    byDay.set(d, (byDay.get(d) ?? 0) + 1)
  }
  const sorted = [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b))
  return sorted.map(([date, count]) => ({
    date,
    time: date,
    count,
    full: format(parseISO(date), 'd MMM yyyy', { locale: pl }),
  }))
}

export function useVisitsChartData(records: PageViewRecord[] | null): ChartDataPoint[] {
  return useMemo(() => {
    if (!records?.length) return []
    return aggregateByDay(records)
  }, [records])
}
