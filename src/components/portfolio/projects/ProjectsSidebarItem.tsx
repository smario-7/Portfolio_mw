import { cn } from '@/lib/utils'
import type { Project } from '@/lib/types'
import { TechIcon } from '@/components/tech-icon'

interface ProjectsSidebarItemProps {
  project: Project
  isSelected: boolean
  onSelect: () => void
}

export function ProjectsSidebarItem({ project, isSelected, onSelect }: ProjectsSidebarItemProps) {
  const colorClass = project.color ?? 'from-primary/30 to-primary/10'

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'hover-lift-sm w-full rounded-lg border border-border/40 bg-card/50 px-3 py-2 text-left transition-colors hover:border-primary/40',
        isSelected && 'border-primary/60 bg-primary/10'
      )}
    >
      <div
        className={cn(
          'mb-2 h-1 w-full rounded-t bg-gradient-to-r',
          colorClass
        )}
      />
      <div className="font-medium text-foreground line-clamp-2">{project.title}</div>
      {project.stack.length > 0 && (
        <div className="mt-1 flex flex-wrap items-center gap-1">
          {project.stack.map((tech) => (
            <TechIcon
              key={tech}
              tech={tech}
              className="h-3.5 w-3.5 text-muted-foreground"
              title={tech}
            />
          ))}
        </div>
      )}
    </button>
  )
}
