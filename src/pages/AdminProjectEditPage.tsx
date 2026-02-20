import { useState, useRef, useEffect, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Loader2, Trash2 } from 'lucide-react'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { useProjectForm } from '@/hooks/use-project-form'
import * as projectsService from '@/lib/services/projects-service'
import { supabase } from '@/lib/supabase/client'
import { uploadProjectFile, deleteProjectFile } from '@/lib/api/storage-api'
import { getStorageBaseUrl } from '@/lib/utils/storage-url'
import type { ProjectAttachment } from '@/lib/types'
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
  ProjectEditBasic,
  ProjectEditStack,
  ProjectEditLinks,
  ProjectEditAttachments,
  ProjectEditFullDescription,
} from '@/components/admin/project-edit'
import { AdminPageContainer } from '@/components/admin/admin-page-container'
import { ADMIN_PAGE_CONTAINER_WIDE_CLASS } from '@/lib/constants/layout'
import { toast } from 'sonner'

export default function AdminProjectEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { projects, setProjects, updateProject, deleteProject } = usePortfolio()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fetchingProject, setFetchingProject] = useState(false)
  const [existingAttachments, setExistingAttachments] = useState<ProjectAttachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const projectId = id != null ? parseInt(id, 10) : NaN
  const project = Number.isNaN(projectId)
    ? null
    : projects.find((p) => p.id === projectId)

  useEffect(() => {
    if (project != null || !supabase || Number.isNaN(projectId)) return
    setFetchingProject(true)
    projectsService
      .getProjectById(projectId)
      .then((fetched) => {
        setProjects((prev) =>
          prev.some((p) => p.id === projectId) ? prev : [...prev, fetched]
        )
      })
      .catch(() => {
        navigate('/admin/projects', { replace: true })
      })
      .finally(() => {
        setFetchingProject(false)
      })
  }, [projectId, project, setProjects, navigate])

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
      downloadLinks: project.downloadLinks,
      status: project.status,
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
    if (fetchingProject && supabase) {
      return (
        <AdminPageContainer>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </AdminPageContainer>
      )
    }
    navigate('/admin/projects', { replace: true })
    return null
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.validateForm()) return

    form.setIsLoading(true)
    try {
      const imageValue =
        form.formData.imagePath?.trim() || project.image || undefined
      const dl = form.formData.downloadLinks ?? {}
      const downloadLinks = {
        ...(dl.pdf ? { pdf: dl.pdf } : {}),
        ...(dl.ipynb ? { ipynb: dl.ipynb } : {}),
        ...(dl.md ? { md: dl.md } : {}),
        ...(dl.image ? { image: dl.image } : {}),
      }
      await updateProject(projectId, {
        title: form.formData.title.trim(),
        description: form.formData.shortDescription.trim(),
        fullDescription:
          form.formData.fullDescriptionBlocks.length > 0
            ? form.formData.fullDescriptionBlocks
            : undefined,
        category: form.formData.category,
        stack: form.formData.technologies,
        github: form.formData.githubUrl.trim(),
        demo: form.formData.demoUrl.trim(),
        image: imageValue,
        attachments: existingAttachments,
        downloadLinks: Object.keys(downloadLinks).length > 0 ? downloadLinks : undefined,
        color: form.formData.color?.trim() || undefined,
        status: form.formData.status,
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

  const removeAttachment = async (path: string) => {
    try {
      await deleteProjectFile(projectId, path)
      setExistingAttachments((prev) => prev.filter((a) => a.path !== path))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Nie udało się usunąć pliku')
    }
  }

  const onImageUpload = async (file: File): Promise<string> => {
    const data = await uploadProjectFile(projectId, file)
    return data.path
  }

  const onImageDelete = async (path: string): Promise<void> => {
    await deleteProjectFile(projectId, path)
  }

  const storageBase = getStorageBaseUrl()

  const existingImagePaths = useMemo(() => {
    const paths: string[] = []
    const current = form.formData.imagePath?.trim()
    if (current && !paths.includes(current)) paths.push(current)
    if (project?.image?.trim() && !paths.includes(project.image.trim())) paths.push(project.image.trim())
    form.formData.fullDescriptionBlocks.forEach((b) => {
      if (b.type === 'screenshot' && b.path?.trim() && !paths.includes(b.path.trim())) {
        paths.push(b.path.trim())
      }
    })
    return paths
  }, [project?.image, form.formData.imagePath, form.formData.fullDescriptionBlocks])

  return (
    <AdminPageContainer className={ADMIN_PAGE_CONTAINER_WIDE_CLASS}>
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
          <ProjectEditBasic
            formData={form.formData}
            setFormData={form.setFormData}
            projectId={projectId}
            existingImagePaths={existingImagePaths}
            onImageUpload={onImageUpload}
            onImageDelete={onImageDelete}
          />
          <ProjectEditStack
            formData={form.formData}
            techInput={form.techInput}
            setTechInput={form.setTechInput}
            onAddTechnology={form.handleAddTechnology}
            onRemoveTechnology={form.handleRemoveTechnology}
          />
          <ProjectEditLinks
            formData={form.formData}
            setFormData={form.setFormData}
            existingAttachments={existingAttachments}
            existingImagePaths={existingImagePaths}
          />
          <ProjectEditAttachments
            fileInputRef={fileInputRef}
            uploading={uploading}
            existingAttachments={existingAttachments}
            storageBase={storageBase}
            onFileAttach={onFileAttach}
            removeAttachment={removeAttachment}
          />
          <ProjectEditFullDescription
            projectId={projectId}
            blocks={form.formData.fullDescriptionBlocks}
            addBlock={form.addBlock}
            removeBlock={form.removeBlock}
            moveBlock={form.moveBlock}
            updateBlock={form.updateBlock}
            existingAttachments={existingAttachments}
            existingImagePaths={existingImagePaths}
            blockErrors={form.errors.fullDescriptionBlocks}
          />

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
    </AdminPageContainer>
  )
}
