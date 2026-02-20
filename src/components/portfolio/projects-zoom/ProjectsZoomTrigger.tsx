import { forwardRef } from 'react'
import { Search } from 'lucide-react'

interface ProjectsZoomTriggerProps {
  onClick: () => void
}

export const ProjectsZoomTrigger = forwardRef<HTMLButtonElement, ProjectsZoomTriggerProps>(
  function ProjectsZoomTrigger({ onClick }, ref) {
    return (
      <div className="fixed top-0 right-0 z-[60] p-1">
        <button
          ref={ref}
          type="button"
          onClick={onClick}
          className="flex items-center justify-center rounded-md p-1.5 text-primary transition-colors hover:bg-primary/10 hover:opacity-90"
          aria-label="Powiększ widok projektów na pełny ekran"
          title="Powiększ widok projektów na pełny ekran"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    )
  }
)
