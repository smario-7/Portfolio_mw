import { Download, FileCode, FileText, Image as ImageIcon, Github, ExternalLink } from 'lucide-react'
import type { Project } from '@/lib/types'
import { getStorageFileUrl } from '@/lib/utils/storage-url'

interface ProjectDetailLinksProps {
  project: Project
}

export function ProjectDetailLinks({ project }: ProjectDetailLinksProps) {
  const dl = project.downloadLinks ?? {}
  const linkClass =
    'flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 font-medium transition-colors hover:bg-card'

  return (
    <div className="flex flex-wrap gap-3">
      {project.github?.trim() && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
      )}
      {project.demo?.trim() && (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <ExternalLink className="h-4 w-4" />
          Demo
        </a>
      )}
      {dl.pdf && (
        <a
          href={getStorageFileUrl(dl.pdf)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <Download className="h-4 w-4" />
          PDF
        </a>
      )}
      {dl.ipynb && (
        <a
          href={getStorageFileUrl(dl.ipynb)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <FileCode className="h-4 w-4" />
          Jupyter
        </a>
      )}
      {dl.md && (
        <a
          href={getStorageFileUrl(dl.md)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <FileText className="h-4 w-4" />
          Markdown
        </a>
      )}
      {dl.image && (
        <a
          href={getStorageFileUrl(dl.image)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <ImageIcon className="h-4 w-4" />
          Obraz
        </a>
      )}
    </div>
  )
}
