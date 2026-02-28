import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ProjectDetail } from '@/components/project-detail'
import type { Project } from '@/lib/types'

interface ProjectPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  previewProject: Project
}

export function ProjectPreviewModal({
  open,
  onOpenChange,
  previewProject,
}: ProjectPreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="fixed inset-0 left-1/5 right-0 top-0 bottom-0 h-full w-3/4 max-w-none sm:max-w-none translate-x-0 translate-y-0 flex flex-col gap-0 rounded-none border-0 p-0 shadow-none"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Podgląd projektu</DialogTitle>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="py-24 px-8 md:px-16 lg:px-16">
            <div className="space-y-12">
              <ProjectDetail project={previewProject} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
