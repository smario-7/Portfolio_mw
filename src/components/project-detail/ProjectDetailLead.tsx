import { ImageIcon } from 'lucide-react'
import type { Project } from '@/lib/types'
import { getStorageFileUrl } from '@/lib/utils/storage-url'

interface ProjectDetailLeadProps {
  project: Project
}

export function ProjectDetailLead({ project }: ProjectDetailLeadProps) {
  const imageSrc = project.image ? getStorageFileUrl(project.image) : ''
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <p className="text-lg text-muted-foreground">{project.description}</p>
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-border bg-card/30 p-8">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={project.title}
            className="max-h-[400px] w-full rounded-lg object-contain"
          />
        ) : (
          <div className="space-y-4 text-center">
            <ImageIcon className="mx-auto h-16 w-16 text-primary" />
            <p className="text-sm text-muted-foreground">Screenshot projektu</p>
          </div>
        )}
      </div>
    </div>
  )
}
