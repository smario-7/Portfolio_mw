import { useRef, useState } from 'react'
import { Upload, Trash2, Image as ImageIcon, Palette } from 'lucide-react'
import { PROJECT_CATEGORIES } from '@/lib/constants/categories'
import type { ProjectCategory } from '@/lib/types'
import type { ProjectFormData } from '@/lib/validation/project-validation'
import { getStorageFileUrl } from '@/lib/utils/storage-url'
import { isValidImageFile } from '@/lib/constants/file-types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { AdminSectionCard } from '@/components/admin/admin-section-card'
import { ColorPickerModal } from '@/components/admin/color-picker-modal'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ProjectEditBasicProps {
  formData: ProjectFormData
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>
  projectId?: number
  existingImagePaths?: string[]
  onImageUpload?: (file: File) => Promise<string>
  onImageDelete?: (path: string) => Promise<void>
}

export function ProjectEditBasic({
  formData,
  setFormData,
  projectId = 0,
  existingImagePaths = [],
  onImageUpload,
  onImageDelete,
}: ProjectEditBasicProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  const imagePath = formData.imagePath?.trim() ?? ''
  const imageUrl = imagePath ? getStorageFileUrl(imagePath) : ''
  const canUpload = projectId > 0 && typeof onImageUpload === 'function'

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !onImageUpload) return
    if (!isValidImageFile(file.name)) {
      toast.error('Dozwolone formaty: .png, .jpg, .jpeg, .webp')
      return
    }
    setUploading(true)
    try {
      const path = await onImageUpload(file)
      setFormData({ ...formData, imagePath: path })
      toast.success('Obraz wgrany')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Błąd wgrywania')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!imagePath || !onImageDelete) return
    setDeleting(true)
    try {
      await onImageDelete(imagePath)
      setFormData({ ...formData, imagePath: '' })
      toast.success('Obraz usunięty')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Nie udało się usunąć obrazu')
    } finally {
      setDeleting(false)
    }
  }

  const imagePathsForSelect = imagePath && !existingImagePaths.includes(imagePath)
    ? [imagePath, ...existingImagePaths]
    : existingImagePaths

  return (
    <AdminSectionCard title="Informacje podstawowe">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Tytuł *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Kategoria *
          </label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                category: value as ProjectCategory,
              })
            }
          >
            <SelectTrigger className="w-full rounded-lg h-10 px-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Widoczność na tablecie
          </label>
          <Select
            value={formData.status}
            onValueChange={(value: 'draft' | 'published') =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger className="w-full rounded-lg h-10 px-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Szkic (niewidoczny)</SelectItem>
              <SelectItem value="published">Opublikowany (widoczny)</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Szkic nie jest wyświetlany w portfolio na tablecie.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Krótki opis *
          </label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) =>
              setFormData({ ...formData, shortDescription: e.target.value })
            }
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
            required
          />
        </div>
        <div className="space-y-3">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Obraz projektu
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="flex flex-wrap items-center gap-2">
            {canUpload && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? 'Wgrywanie...' : <><Upload className="mr-2 h-4 w-4" />Wybierz plik</>}
              </Button>
            )}
            {projectId > 0 && imagePathsForSelect.length > 0 && (
              <select
                value={imagePath}
                onChange={(e) => setFormData({ ...formData, imagePath: e.target.value })}
                className="rounded-lg border-2 border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">— lub wybierz z istniejących —</option>
                {imagePathsForSelect.map((path) => (
                  <option key={path} value={path}>
                    {path.split('/').pop() ?? path}
                  </option>
                ))}
              </select>
            )}
            {imagePath && onImageDelete && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={deleting}
                onClick={handleRemoveImage}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                {deleting ? 'Usuwanie...' : <><Trash2 className="mr-2 h-4 w-4" />Usuń obraz</>}
              </Button>
            )}
          </div>
          {imageUrl && (
            <div className="flex items-center gap-2 mt-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <img
                src={imageUrl}
                alt="Podgląd obrazu projektu"
                className="max-h-32 rounded-lg border border-border object-contain"
              />
            </div>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <label className="mb-2 block text-sm font-medium text-foreground">
          Kolor karty
        </label>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'size-12 shrink-0 rounded-lg border-2 border-border bg-gradient-to-br',
              formData.color?.trim()
                ? formData.color
                : 'from-primary/20 via-accent/10 to-transparent'
            )}
            aria-hidden
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setColorPickerOpen(true)}
          >
            <Palette className="mr-2 h-4 w-4" />
            Wybierz kolor
          </Button>
        </div>
        <ColorPickerModal
          open={colorPickerOpen}
          onOpenChange={setColorPickerOpen}
          value={formData.color?.trim() || undefined}
          onSelect={(color) => setFormData({ ...formData, color: color ?? '' })}
        />
      </div>
    </AdminSectionCard>
  )
}
