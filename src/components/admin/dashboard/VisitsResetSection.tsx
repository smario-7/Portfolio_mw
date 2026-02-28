import { useEffect, useState, useCallback } from 'react'
import { format, parseISO } from 'date-fns'
import { pl } from 'date-fns/locale'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import * as pageViewsService from '@/lib/services/page-views-service'
import type { PageViewRecord } from '@/lib/services/page-views-service'
import { toast } from 'sonner'
import { PageViewsLoadError, PageViewsDeleteError, reportError } from '@/lib/errors'
import { cn } from '@/lib/utils'

interface VisitsResetSectionProps {
  page?: string
  onDeleted?: () => void
}

function groupByDate(records: PageViewRecord[]): Map<string, PageViewRecord[]> {
  const map = new Map<string, PageViewRecord[]>()
  for (const r of records) {
    const key = format(parseISO(r.viewed_at), 'yyyy-MM-dd')
    const list = map.get(key) ?? []
    list.push(r)
    map.set(key, list)
  }
  for (const list of map.values()) {
    list.sort((a, b) => b.viewed_at.localeCompare(a.viewed_at))
  }
  return map
}

export function VisitsResetSection({ page = 'home', onDeleted }: VisitsResetSectionProps) {
  const [records, setRecords] = useState<PageViewRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    pageViewsService.getAllPageViews(page)
      .then(setRecords)
      .catch((err) => {
        const msg = reportError(new PageViewsLoadError('getAllPageViews', err), {
          context: 'visits_reset_load',
        })
        setRecords([])
        toast.error(msg)
      })
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => {
    load()
  }, [load])

  const grouped = groupByDate(records)
  const sortedDates = [...grouped.keys()].sort((a, b) => b.localeCompare(a))

  const toggleId = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleDate = (date: string) => {
    const list = grouped.get(date) ?? []
    const ids = new Set(list.map((r) => r.id))
    const allSelected = list.every((r) => selectedIds.has(r.id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allSelected) {
        ids.forEach((id) => next.delete(id))
      } else {
        ids.forEach((id) => next.add(id))
      }
      return next
    })
  }

  const handleDelete = () => {
    const ids = [...selectedIds]
    if (ids.length === 0) {
      toast.info('Zaznacz co najmniej jeden wpis')
      return
    }
    setDeleting(true)
    pageViewsService.deletePageViewIds(ids)
      .then(() => {
        setSelectedIds(new Set())
        load()
        onDeleted?.()
        toast.success('Usunięto wybrane wpisy')
      })
      .catch((err) => {
        const msg = reportError(new PageViewsDeleteError('deletePageViewIds', err), {
          context: 'visits_reset_delete',
        })
        toast.error(msg)
      })
      .finally(() => setDeleting(false))
  }

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-muted-foreground text-sm mb-3">
        Zaznacz wpisy po datach, które chcesz usunąć, następnie kliknij „Usuń wybrane”.
      </p>
      {loading ? (
        <p className="text-sm text-muted-foreground">Ładowanie…</p>
      ) : sortedDates.length === 0 ? (
        <p className="text-sm text-muted-foreground">Brak wpisów.</p>
      ) : (
        <>
          <ScrollArea className="h-[220px] rounded border border-border p-2">
            <ul className="space-y-3">
              {sortedDates.map((date) => {
                const list = grouped.get(date) ?? []
                const dateLabel = format(parseISO(date), 'd MMMM yyyy', { locale: pl })
                const allSelected = list.every((r) => selectedIds.has(r.id))
                const someSelected = list.some((r) => selectedIds.has(r.id))
                return (
                  <li key={date}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Checkbox
                        id={`date-${date}`}
                        checked={
                          allSelected
                            ? true
                            : someSelected
                              ? 'indeterminate'
                              : false
                        }
                        onCheckedChange={() => toggleDate(date)}
                      />
                      <label
                        htmlFor={`date-${date}`}
                        className={cn(
                          'text-sm font-medium cursor-pointer',
                          someSelected && 'text-primary'
                        )}
                      >
                        {dateLabel} ({list.length})
                      </label>
                    </div>
                    <ul className="ml-6 space-y-1">
                      {list.map((r) => (
                        <li key={r.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`rec-${r.id}`}
                            checked={selectedIds.has(r.id)}
                            onCheckedChange={() => toggleId(r.id)}
                          />
                          <label
                            htmlFor={`rec-${r.id}`}
                            className="text-muted-foreground text-xs cursor-pointer"
                          >
                            {format(parseISO(r.viewed_at), 'HH:mm:ss', { locale: pl })}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="mt-3"
            onClick={handleDelete}
            disabled={deleting || selectedIds.size === 0}
          >
            <Trash2 className="size-4 mr-1" />
            Usuń wybrane ({selectedIds.size})
          </Button>
        </>
      )}
    </div>
  )
}
