import type { ProjectFormData } from '@/lib/validation/project-validation'
import { Button } from '@/components/ui/button'
import { AdminSectionCard } from '@/components/admin/AdminSectionCard'

interface ProjectEditStackProps {
  formData: ProjectFormData
  techInput: string
  setTechInput: React.Dispatch<React.SetStateAction<string>>
  onAddTechnology: () => void
  onRemoveTechnology: (tech: string) => void
}

export function ProjectEditStack({
  formData,
  techInput,
  setTechInput,
  onAddTechnology,
  onRemoveTechnology,
}: ProjectEditStackProps) {
  return (
    <AdminSectionCard title="Stack">
      <div className="flex gap-2">
        <input
          type="text"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' && (e.preventDefault(), onAddTechnology())
          }
          placeholder="np. React, TypeScript"
          className="flex-1 rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
        />
        <Button type="button" variant="secondary" onClick={onAddTechnology}>
          Dodaj
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.technologies.map((tech) => (
          <span
            key={tech}
            className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
          >
            {tech}
            <button
              type="button"
              onClick={() => onRemoveTechnology(tech)}
              className="hover:opacity-70"
              aria-label={`Usuń ${tech}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </AdminSectionCard>
  )
}
