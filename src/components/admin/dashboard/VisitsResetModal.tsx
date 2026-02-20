import { useState } from 'react'
import { AppModal } from '@/components/shared'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft } from 'lucide-react'
import { VisitsResetSection } from '@/components/admin/dashboard/VisitsResetSection'

const PAGE_OPTIONS = [{ id: 'home', label: 'Strona główna' }] as const

interface VisitsResetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}

export function VisitsResetModal({
  open,
  onOpenChange,
  onDeleted,
}: VisitsResetModalProps) {
  const [selectedPage, setSelectedPage] = useState<string | null>(null)

  const handleOpenChange = (next: boolean) => {
    if (!next) setSelectedPage(null)
    onOpenChange(next)
  }

  const handleDeleted = () => {
    onDeleted?.()
  }

  return (
    <AppModal
      open={open}
      onOpenChange={handleOpenChange}
      contentClassName="max-w-lg"
      aria-describedby="reset-visits-desc"
    >
      <DialogHeader>
          <DialogTitle>Resetuj liczbę odwiedzin</DialogTitle>
          <DialogDescription id="reset-visits-desc">
            Wybierz stronę i zaznacz wpisy do usunięcia.
          </DialogDescription>
        </DialogHeader>

        {selectedPage === null ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Wybierz stronę, dla której chcesz usunąć wpisy odwiedzin:
            </p>
            <ScrollArea className="max-h-[240px] rounded border border-border">
              <ul className="p-2 space-y-1">
                {PAGE_OPTIONS.map((opt) => (
                  <li key={opt.id}>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setSelectedPage(opt.id)}
                    >
                      {opt.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-2 -ml-2"
              onClick={() => setSelectedPage(null)}
            >
              <ArrowLeft className="size-4" />
              Wstecz
            </Button>
            <VisitsResetSection
              page={selectedPage}
              onDeleted={handleDeleted}
            />
          </div>
        )}
    </AppModal>
  )
}
