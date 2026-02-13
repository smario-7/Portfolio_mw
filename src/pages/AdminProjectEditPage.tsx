import { useState, useRef, useEffect, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Loader2, Trash2, Paperclip, X } from 'lucide-react'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { useProjectForm } from '@/hooks/use-project-form'
import { PROJECT_CATEGORIES } from '@/lib/constants/categories'
import { uploadProjectFile } from '@/lib/api/storage-api'
import type { ProjectCategory, ProjectAttachment } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

export default function AdminProjectEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { projects, updateProject, deleteProject } = usePortfolio()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [existingAttachments, setExistingAttachments] = useState<ProjectAttachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const projectId = id != null ? parseInt(id, 10) : NaN
  const project = Number.isNaN(projectId)
    ? null
    : projects.find((p) => p.id === projectId)

  const initialData = useMemo(() => {
    if (!project) return undefined
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      fullDescription: project.fullDescription,
      category: project.category,
      stack: project.stack,
      github: project.github,
      demo: project.demo,
      image: project.image,
      color: project.color,
    }
  }, [project])

  const form = useProjectForm({
    mode: 'edit',
    initialData,
    projects,
  })

  useEffect(() => {
    if (project?.attachments) {
      setExistingAttachments([...project.attachments])
    } else {
      setExistingAttachments([])
    }
  }, [project?.id])

  if (id == null || Number.isNaN(projectId)) {
    navigate('/admin/projects', { replace: true })
    return null
  }

  if (project == null) {
    navigate('/admin/projects', { replace: true })
    return null
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.validateForm()) return

    form.setIsLoading(true)
    try {
      updateProject(projectId, {
        title: form.formData.title.trim(),
        description: form.formData.shortDescription.trim(),
        fullDescription: form.formData.description.trim() || undefined,
        category: form.formData.category,
        stack: form.formData.technologies,
        github: form.formData.githubUrl.trim(),
        demo: form.formData.demoUrl.trim(),
        image: form.formData.image ? project.image : project.image,
        attachments: existingAttachments,
      })
      toast.success('Projekt zaktualizowany')
      navigate('/admin/projects')
    } catch {
      toast.error('Nie udało się zapisać')
    } finally {
      form.setIsLoading(false)
    }
  }

  const handleDelete = () => {
    deleteProject(projectId)
    setShowDeleteDialog(false)
    toast.success('Projekt usunięty')
    navigate('/admin/projects')
  }

  const onFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    try {
      const data = await uploadProjectFile(projectId, file)
      setExistingAttachments((prev) => [
        ...prev,
        { label: data.label, path: data.path, type: data.type as ProjectAttachment['type'] },
      ])
      toast.success('Załącznik dodany')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Błąd dodawania pliku')
    } finally {
      setUploading(false)
    }
  }

  const removeAttachment = (path: string) => {
    setExistingAttachments((prev) => prev.filter((a) => a.path !== path))
  }

  const apiBaseUrl =
    typeof import.meta.env.VITE_API_URL === 'string'
      ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
      : ''
  const storageBase = apiBaseUrl ? new URL(apiBaseUrl).origin : ''

  return (
    <div className="mx-auto max-w-4xl">
      <div className="sticky top-0 z-10 -mx-4 px-4 py-4 bg-background/95 backdrop-blur-sm border-b border-border mb-6">
        <div className="mb-4">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
            Wróć
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Edycja projektu
            </h1>
            <p className="text-muted-foreground">
              {project?.title ?? 'Ładowanie…'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Usuń projekt
            </Button>
            <Button type="submit" form="project-edit-form" disabled={form.isLoading}>
              {form.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                'Zapisz zmiany'
              )}
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-14rem)]">
        <form id="project-edit-form" onSubmit={handleSave} className="space-y-8 pr-4">
        <div className="space-y-6 rounded-lg border-2 border-border bg-card/30 p-6">
          <h2 className="text-xl font-semibold text-foreground">
            Informacje podstawowe
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Tytuł *
              </label>
              <input
                type="text"
                value={form.formData.title}
                onChange={(e) =>
                  form.setFormData({ ...form.formData, title: e.target.value })
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
                value={form.formData.category}
                onValueChange={(value) =>
                  form.setFormData({
                    ...form.formData,
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
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Krótki opis *
            </label>
            <input
              type="text"
              value={form.formData.shortDescription}
              onChange={(e) =>
                form.setFormData({ ...form.formData, shortDescription: e.target.value })
              }
              className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Pełny opis (opcjonalnie)
            </label>
            <textarea
              value={form.formData.description}
              onChange={(e) =>
                form.setFormData({ ...form.formData, description: e.target.value })
              }
              rows={4}
              className="w-full resize-none rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-6 rounded-lg border-2 border-border bg-card/30 p-6">
          <h2 className="text-xl font-semibold text-foreground">Stack</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={form.techInput}
              onChange={(e) => form.setTechInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && (e.preventDefault(), form.handleAddTechnology())
              }
              placeholder="np. React, TypeScript"
              className="flex-1 rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
            />
            <Button type="button" variant="secondary" onClick={form.handleAddTechnology}>
              Dodaj
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.formData.technologies.map((tech) => (
              <span
                key={tech}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => form.handleRemoveTechnology(tech)}
                  className="hover:opacity-70"
                  aria-label={`Usuń ${tech}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-6 rounded-lg border-2 border-border bg-card/30 p-6">
          <h2 className="text-xl font-semibold text-foreground">Linki</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                GitHub *
              </label>
              <input
                type="url"
                value={form.formData.githubUrl}
                onChange={(e) =>
                  form.setFormData({ ...form.formData, githubUrl: e.target.value })
                }
                className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Demo *
              </label>
              <input
                type="url"
                value={form.formData.demoUrl}
                onChange={(e) =>
                  form.setFormData({ ...form.formData, demoUrl: e.target.value })
                }
                className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-lg border-2 border-border bg-card/30 p-6">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            Załączniki (PDF, .ipynb, .md)
          </h2>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.ipynb,.md,application/pdf"
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
          <ul className="space-y-2">
            {existingAttachments.map((a) => (
              <li
                key={a.path}
                className="flex items-center justify-between rounded-lg border-2 border-border bg-background/50 px-4 py-2"
              >
                <a
                  href={storageBase ? `${storageBase}/${a.path}` : a.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline truncate flex-1 min-w-0"
                >
                  {a.label}
                </a>
                <button
                  type="button"
                  onClick={() => removeAttachment(a.path)}
                  className="ml-2 p-1 text-muted-foreground hover:text-destructive"
                  aria-label="Usuń załącznik"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4">
          <Link
            to="/admin/projects"
            className="flex-1 rounded-lg border-2 border-border px-6 py-3 text-center font-medium text-foreground transition-colors hover:bg-card"
          >
            Anuluj
          </Link>
        </div>
      </form>
      </ScrollArea>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć projekt?</AlertDialogTitle>
            <AlertDialogDescription>
              Projekt „{project?.title}” zostanie trwale usunięty. Tej operacji
              nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
