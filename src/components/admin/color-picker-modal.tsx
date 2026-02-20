import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PROJECT_CARD_COLORS } from '@/lib/constants/project-colors'
import { cn } from '@/lib/utils'

interface ColorPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: string | undefined
  onSelect: (color: string | undefined) => void
}

const DEFAULT_LABEL = 'Domyślny'

export function ColorPickerModal({
  open,
  onOpenChange,
  value,
  onSelect,
}: ColorPickerModalProps) {
  const handleSelect = (color: string | undefined) => {
    onSelect(color)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" showCloseButton>
        <DialogHeader>
          <DialogTitle>Wybierz kolor karty</DialogTitle>
          <DialogDescription>Wybierz kolor karty projektu na liście projektów.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => handleSelect(undefined)}
            >
              <span
                className={cn(
                  'inline-block size-6 rounded border-2 border-border bg-gradient-to-br from-primary/20 via-accent/10 to-transparent'
                )}
                aria-hidden
              />
              <span className="ml-2">{DEFAULT_LABEL}</span>
            </Button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {PROJECT_CARD_COLORS.map((colorClass) => (
              <button
                key={colorClass}
                type="button"
                onClick={() => handleSelect(colorClass)}
                className={cn(
                  'aspect-square rounded-lg border-2 bg-gradient-to-br transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  colorClass,
                  value === colorClass
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-border'
                )}
                title={colorClass}
                aria-label={`Kolor: ${colorClass}`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
