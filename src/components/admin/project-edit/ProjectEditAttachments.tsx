import { useState } from 'react'
import { Loader2, X } from 'lucide-react'
import type { ProjectAttachment } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { AdminSectionCard } from '@/components/admin/AdminSectionCard'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { getStorageFileUrl } from '@/lib/utils/storage-url'

interface ProjectEditAttachmentsProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>
  uploading: boolean
  existingAttachments: ProjectAttachment[]
  storageBase: string
  onFileAttach: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeAttachment: (path: string) => void
}

export function ProjectEditAttachments({
  fileInputRef,
  uploading,
  existingAttachments,
  storageBase,
  onFileAttach,
  removeAttachment,
}: ProjectEditAttachmentsProps) {
  const [pathToRemove, setPathToRemove] = useState<string | null>(null)
  const attachmentToRemove = pathToRemove
    ? existingAttachments.find((att) => att.path === pathToRemove)
    : undefined
  const labelToRemove = attachmentToRemove?.label ?? pathToRemove ?? ''
  const handleConfirmRemove = () => {
    if (pathToRemove) {
      removeAttachment(pathToRemove)
      setPathToRemove(null)
    }
  }

  const fileUrl = (path: string) =>
    storageBase ? `${storageBase}/${path}` : getStorageFileUrl(path)

  return (
    <AdminSectionCard title="Załączniki (PDF, .ipynb, .md, .py)">
      <p className="mb-4 text-sm text-muted-foreground">Lista plików projektu</p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.ipynb,.md,.py,application/pdf,text/x-python"
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
      {existingAttachments.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Brak załączników</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {existingAttachments.map((a) => (
            <li
              key={a.path}
              className="flex items-center justify-between rounded-lg border-2 border-border bg-background/50 px-4 py-2"
            >
              <a
                href={fileUrl(a.path)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline truncate flex-1 min-w-0"
              >
                {a.label}
              </a>
              <button
                type="button"
                onClick={() => setPathToRemove(a.path)}
                className="ml-2 p-1 text-muted-foreground hover:text-destructive"
                aria-label="Usuń załącznik"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog
        open={pathToRemove != null}
        onOpenChange={(open: boolean) => {
          if (!open) setPathToRemove(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć plik z projektu?</AlertDialogTitle>
            <AlertDialogDescription>
              Plik „{labelToRemove}” zostanie usunięty z projektu. Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminSectionCard>
  )
}
