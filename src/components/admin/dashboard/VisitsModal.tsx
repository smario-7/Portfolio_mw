import { useEffect, useState } from 'react'
import { AppModal } from '@/components/shared'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { LineChart as LineIcon, BarChart2, ScatterChart } from 'lucide-react'
import { getAllPageViews } from '@/lib/api/page-views-api'
import { useVisitsChartData } from '@/hooks/use-visits-chart-data'
import { VisitsChart } from '@/components/admin/dashboard/visits-chart/VisitsChart'
import { VisitsResetModal } from '@/components/admin/dashboard/VisitsResetModal'
import type { VisitsChartType } from '@/components/admin/dashboard/types'

interface VisitsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDataChange?: () => void
}

export function VisitsModal({ open, onOpenChange, onDataChange }: VisitsModalProps) {
  const [chartType, setChartType] = useState<VisitsChartType>('line')
  const [records, setRecords] = useState<{ id: number; viewed_at: string }[] | null>(null)
  const [resetModalOpen, setResetModalOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    getAllPageViews('home')
      .then(setRecords)
      .catch(() => setRecords([]))
  }, [open])

  const chartData = useVisitsChartData(records)

  const handleDeleted = () => {
    getAllPageViews('home').then(setRecords).catch(() => setRecords([]))
    onDataChange?.()
  }

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      contentClassName="!max-w-none w-[75vw] aspect-video max-h-[90vh] flex flex-col gap-4 overflow-hidden p-6"
      aria-describedby="visits-modal-desc"
    >
      <DialogHeader>
          <DialogTitle>Odwiedziny — strona główna</DialogTitle>
          <DialogDescription id="visits-modal-desc">
            Wykres i statystyki odwiedzin strony głównej.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Typ wykresu:</span>
          <ToggleGroup
            type="single"
            value={chartType}
            onValueChange={(v) => v && setChartType(v as VisitsChartType)}
            className="gap-0"
          >
            <ToggleGroupItem value="line" aria-label="Liniowy">
              <LineIcon className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="bar" aria-label="Słupkowy">
              <BarChart2 className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="scatter" aria-label="Punktowy">
              <ScatterChart className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="min-h-0 flex-1">
          <VisitsChart data={chartData} chartType={chartType} />
        </div>

        <div className="flex justify-between items-center border-t border-border pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setResetModalOpen(true)}
          >
            Resetuj liczbę odwiedzin
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Zamknij
          </Button>
        </div>

      <VisitsResetModal
        open={resetModalOpen}
        onOpenChange={setResetModalOpen}
        onDeleted={handleDeleted}
      />
    </AppModal>
  )
}
