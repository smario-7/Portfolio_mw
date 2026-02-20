import { ChevronLeft } from 'lucide-react'

interface ProjectsZoomOverlayProps {
  visible: boolean
  onClose: () => void
}

export function ProjectsZoomOverlay({ visible, onClose }: ProjectsZoomOverlayProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[50] flex flex-col pointer-events-none">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur pointer-events-auto">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-6 py-4 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Zamknij widok pełnoekranowy"
        >
          <ChevronLeft className="h-4 w-4" />
          Zamknij
        </button>
      </div>
    </div>
  )
}
