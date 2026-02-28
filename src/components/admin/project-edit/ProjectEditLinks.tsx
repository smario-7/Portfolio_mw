import { Download, FileCode, FileText } from 'lucide-react'
import type { ProjectAttachment } from '@/lib/types'
import type { ProjectFormData } from '@/lib/validation/project-validation'
import { AdminSectionCard } from '@/components/admin/AdminSectionCard'

interface ProjectEditLinksFieldErrors {
  githubUrl?: string
  demoUrl?: string
}

interface ProjectEditLinksProps {
  formData: ProjectFormData
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>
  attachmentPool: ProjectAttachment[]
  existingAttachments: ProjectAttachment[]
  onAttachmentToggle: (path: string) => void
  fieldErrors?: ProjectEditLinksFieldErrors
}

function AttachmentIcon({ type }: { type?: ProjectAttachment['type'] }) {
  if (type === 'ipynb' || type === 'py') return <FileCode className="h-4 w-4 shrink-0" />
  if (type === 'md') return <FileText className="h-4 w-4 shrink-0" />
  return <Download className="h-4 w-4 shrink-0" />
}

export function ProjectEditLinks({
  formData,
  setFormData,
  attachmentPool,
  existingAttachments,
  onAttachmentToggle,
  fieldErrors,
}: ProjectEditLinksProps) {
  const isSelected = (path: string) =>
    existingAttachments.some((a) => a.path === path)

  return (
    <AdminSectionCard title="Linki">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">GitHub</label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) =>
              setFormData({ ...formData, githubUrl: e.target.value })
            }
            placeholder="https://github.com/..."
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          />
          {fieldErrors?.githubUrl && (
            <p className="mt-1.5 text-sm text-destructive">{fieldErrors.githubUrl}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Demo</label>
          <input
            type="url"
            value={formData.demoUrl}
            onChange={(e) =>
              setFormData({ ...formData, demoUrl: e.target.value })
            }
            placeholder="https://demo.example.com"
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          />
          {fieldErrors?.demoUrl && (
            <p className="mt-1.5 text-sm text-destructive">{fieldErrors.demoUrl}</p>
          )}
        </div>
      </div>

      {attachmentPool.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-foreground">
            Pliki do pobierania na tablecie
          </h3>
          <p className="text-xs text-muted-foreground">
            Zaznacz pliki, które mają być dostępne do pobrania w widoku projektu na tablecie.
          </p>
          <ul className="space-y-2">
            {attachmentPool.map((item) => (
              <li key={item.path}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-border bg-background/50 px-4 py-2 hover:bg-background/80">
                  <input
                    type="checkbox"
                    checked={isSelected(item.path)}
                    onChange={() => onAttachmentToggle(item.path)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <AttachmentIcon type={item.type} />
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                    {item.label}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminSectionCard>
  )
}
