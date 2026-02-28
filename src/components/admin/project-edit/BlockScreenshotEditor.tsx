import { useRef, useState, useEffect } from 'react'
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react'
import type { BlockScreenshot } from '@/lib/types'
import * as storageService from '@/lib/services/storage-service'
import { getStorageFileUrl } from '@/lib/utils/storage-url'
import { isValidImageFile } from '@/lib/constants/file-types'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface BlockScreenshotEditorProps {
  projectId: number
  block: BlockScreenshot
  onChange: (block: BlockScreenshot) => void
  existingImagePaths: string[]
  onRemoveBlock?: () => void
  onStorageImageDeleted?: (path: string) => void
  onStorageImageUploaded?: (path: string) => void
}

export function BlockScreenshotEditor({
  projectId,
  block,
  onChange,
  existingImagePaths,
  onRemoveBlock,
  onStorageImageDeleted,
  onStorageImageUploaded,
}: BlockScreenshotEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (!block.path) setLoadError(false)
  }, [block.path])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!isValidImageFile(file.name)) {
      toast.error('Dozwolone formaty: .png, .jpg, .jpeg, .webp')
      return
    }
    setUploading(true)
    try {
      const data = await storageService.uploadProjectFile(projectId, file)
      onChange({ ...block, path: data.path })
      onStorageImageUploaded?.(data.path)
      toast.success('Obrazek wgrany')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Błąd wgrywania')
    } finally {
      setUploading(false)
    }
  }

  const imageUrl = block.path ? getStorageFileUrl(block.path) : ''
  const canUpload = projectId > 0

  if (block.path && loadError) {
    return (
      <div className="space-y-3">
        <div className="flex min-h-[80px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
          Brak pliku
        </div>
        {onRemoveBlock && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={onRemoveBlock}
          >
            Usuń ten blok z widoku
          </Button>
        )}
      </div>
    )
  }

  const handleRemoveFile = async () => {
    if (!block.path) return
    setDeleting(true)
    try {
      await storageService.deleteProjectFile(projectId, block.path)
      onStorageImageDeleted?.(block.path)
      onChange({ ...block, path: '' })
      toast.success('Plik usunięty')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Nie udało się usunąć pliku')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileSelect}
        />
        {canUpload && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              'Wgrywanie...'
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Wybierz plik
              </>
            )}
          </Button>
        )}
        {existingImagePaths.length > 0 && (
          <select
            value={block.path}
            onChange={(e) => onChange({ ...block, path: e.target.value })}
            className="rounded-lg border-2 border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">— lub wybierz z istniejących —</option>
            {existingImagePaths.map((path) => (
              <option key={path} value={path}>
                {path.split('/').pop() ?? path}
              </option>
            ))}
          </select>
        )}
        {block.path && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={deleting}
            onClick={handleRemoveFile}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            {deleting ? 'Usuwanie...' : <><Trash2 className="mr-2 h-4 w-4" />Usuń plik</>}
          </Button>
        )}
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Ścieżka</label>
          <input
            type="text"
            value={block.path}
            onChange={(e) => onChange({ ...block, path: e.target.value })}
            placeholder="np. storage/projects/1/obraz.png"
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Opis (alt)</label>
          <input
            type="text"
            value={block.alt ?? ''}
            onChange={(e) => onChange({ ...block, alt: e.target.value || undefined })}
            placeholder="Opis obrazka"
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none text-sm"
          />
        </div>
      </div>
      {imageUrl && (
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          <img
            src={imageUrl}
            alt={block.alt ?? 'Podgląd'}
            className="max-h-32 rounded-lg border border-border object-contain"
            onError={() => setLoadError(true)}
            onLoad={() => setLoadError(false)}
          />
        </div>
      )}
    </div>
  )
}
