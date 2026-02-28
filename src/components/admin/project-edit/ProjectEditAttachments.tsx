import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminSectionCard } from '@/components/admin/AdminSectionCard'
import { getAttachmentAcceptString } from '@/lib/constants/file-types'

interface ProjectEditAttachmentsProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>
  uploading: boolean
  onFileAttach: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ProjectEditAttachments({
  fileInputRef,
  uploading,
  onFileAttach,
}: ProjectEditAttachmentsProps) {
  return (
    <AdminSectionCard title="Załączniki wyświetlane na tablecie">
      <p className="mb-4 text-sm text-muted-foreground">
        Wgraj pliki do puli projektu (PDF, .ipynb, .md, .py). Które pliki mają być dostępne do
        pobrania na tablecie wybierasz w sekcji Linki.
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAttachmentAcceptString()}
        className="hidden"
        onChange={onFileAttach}
      />
      <Button
        type="button"
        variant="secondary"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wgrywanie...
          </>
        ) : (
          'Wybierz plik'
        )}
      </Button>
    </AdminSectionCard>
  )
}
