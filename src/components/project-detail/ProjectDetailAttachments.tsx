import { Download, FileCode, FileText } from 'lucide-react'
import type { Project, ProjectAttachment } from '@/lib/types'
import { getStorageFileUrl } from '@/lib/utils/storage-url'

interface ProjectDetailAttachmentsProps {
  project: Project
}

function AttachmentIcon({ type }: { type?: ProjectAttachment['type'] }) {
  if (type === 'ipynb' || type === 'py') return <FileCode className="h-4 w-4" />
  if (type === 'md') return <FileText className="h-4 w-4" />
  return <Download className="h-4 w-4" />
}

export function ProjectDetailAttachments({ project }: ProjectDetailAttachmentsProps) {
  const attachments = project.attachments ?? []
  if (attachments.length === 0) return null

  return (
    <div className="flex flex-wrap gap-3">
      {attachments.map((att, idx) => (
        <a
          key={idx}
          href={getStorageFileUrl(att.path)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 font-medium transition-colors hover:bg-card"
        >
          <AttachmentIcon type={att.type} />
          {att.label}
        </a>
      ))}
    </div>
  )
}
