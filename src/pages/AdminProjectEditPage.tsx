import { useState, useRef, useEffect, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Eye, Loader2, Trash2 } from 'lucide-react'
import { useProjects } from '@/contexts/PortfolioContext'
import { useProjectForm } from '@/hooks/use-project-form'
import * as projectsService from '@/lib/services/projects-service'
import { supabase } from '@/lib/supabase/client'
import * as storageService from '@/lib/services/storage-service'
import { isValidAttachmentFile, pathToAttachment } from '@/lib/constants/file-types'
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
import { AdminPageContainer } from '@/components/admin/AdminPageContainer'
import { ProjectPreviewModal } from '@/components/admin/project-preview'
import { buildProjectFromFormData } from '@/lib/data/project-normalize'
import { ADMIN_PROJECTS } from '@/lib/constants/routes'
import { ADMIN_PAGE_CONTAINER_WIDE_CLASS } from '@/lib/constants/layout'
import { toast } from 'sonner'
import { ProjectLoadError, reportError } from '@/lib/errors'

export default function AdminProjectEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { projects, setProjects, updateProject, deleteProject } = useProjects()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [_fetchingProject, setFetchingProject] = useState(false)
  const [existingAttachments, setExistingAttachments] = useState<ProjectAttachment[]>([])
  const [attachmentPool, setAttachmentPool] = useState<ProjectAttachment[]>([])
  const [storageImagePaths, setStorageImagePaths] = useState<string[]>([])
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
      .catch((err) => {
        const msg = reportError(new ProjectLoadError('getProjectById', err), {
          context: 'admin_project_edit_load',
        })
        toast.error(msg)
        navigate(ADMIN_PROJECTS, { replace: true })
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

  useEffect(() => {
    if (!projectId) return
    storageService.listProjectFilePaths(projectId)
      .then(setStorageImagePaths)
      .catch((err) => {
        reportError(err, { context: 'admin_project_edit_storage_list' })
        setStorageImagePaths([])
      })
  }, [projectId])

  useEffect(() => {
    if (!projectId) return
    storageService.listProjectFilePaths(projectId)
      .then((paths) => {
        const pool = paths
          .filter((p) => isValidAttachmentFile(p))
          .map(pathToAttachment)
        setAttachmentPool(pool)
      })
      .catch((err) => {
        reportError(err, { context: 'admin_project_edit_attachment_pool' })
        setAttachmentPool([])
      })
  }, [projectId])

  if (id == null || Number.isNaN(projectId)) {
    navigate(ADMIN_PROJECTS, { replace: true })
    return null
  }

  if (project == null) {
    if (supabase) {
      return (
        <AdminPageContainer>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </AdminPageContainer>
      )
    }
    navigate(ADMIN_PROJECTS, { replace: true })
    return null
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.validateForm()) {
      toast.error('Popraw błędy w formularzu')
      return
    }

    form.setIsLoading(true)
    try {
      const imageValue =
        form.formData.imagePath?.trim() || project.image || undefined
      await updateProject(projectId, {
        title: form.formData.title.trim(),
        description: form.formData.shortDescription.trim(),
        fullDescription: form.formData.fullDescriptionBlocks,
        category: form.formData.category,
        stack: form.formData.technologies,
        github: form.formData.githubUrl.trim(),
        demo: form.formData.demoUrl.trim(),
        image: imageValue,
        attachments: existingAttachments,
        color: form.formData.color?.trim() || undefined,
        status: form.formData.status,
      })
      toast.success('Projekt zaktualizowany')
      navigate(ADMIN_PROJECTS)
    } catch {
      // błąd zapisu – toast wyświetla PortfolioContext.updateProject
    } finally {
      form.setIsLoading(false)
    }
  }

  const handleDelete = () => {
    deleteProject(projectId)
    setShowDeleteDialog(false)
    toast.success('Projekt usunięty')
    navigate(ADMIN_PROJECTS)
  }

  const onFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    try {
      await storageService.uploadProjectFile(projectId, file)
      toast.success('Plik wgrany. Dodaj go do listy z puli poniżej.')
      storageService.listProjectFilePaths(projectId)
        .then((paths) => {
          const pool = paths
            .filter((p) => isValidAttachmentFile(p))
            .map(pathToAttachment)
          setAttachmentPool(pool)
        })
        .catch((err) => {
          reportError(err, { context: 'admin_project_edit_attachment_pool_refresh' })
        })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Błąd dodawania pliku')
    } finally {
      setUploading(false)
    }
  }

  const onAttachmentToggle = (path: string) => {
    setExistingAttachments((prev) => {
      const isInList = prev.some((a) => a.path === path)
      if (isInList) return prev.filter((a) => a.path !== path)
      const item = attachmentPool.find((p) => p.path === path)
      return item ? [...prev, item] : prev
    })
  }

  const onImageUpload = async (file: File): Promise<string> => {
    const data = await storageService.uploadProjectFile(projectId, file)
    setStorageImagePaths((prev) => (prev.includes(data.path) ? prev : [...prev, data.path]))
    return data.path
  }

  const onImageDelete = async (path: string): Promise<void> => {
    await storageService.deleteProjectFile(projectId, path)
    setStorageImagePaths((prev) => prev.filter((p) => p !== path))
  }

  const onStorageImageDeleted = (path: string) => {
    setStorageImagePaths((prev) => prev.filter((p) => p !== path))
  }

  const onStorageImageUploaded = (path: string) => {
    setStorageImagePaths((prev) => (prev.includes(path) ? prev : [...prev, path]))
  }

  const previewProject = buildProjectFromFormData({
    formData: form.formData,
    attachments: existingAttachments,
    projectId: project.id,
    existingImagePath: project.image,
  })

  return (
    <AdminPageContainer className={ADMIN_PAGE_CONTAINER_WIDE_CLASS}>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b border-border bg-background/95 px-4 py-4 backdrop-blur-sm">
          <div className="mb-4">
            <Link
              to={ADMIN_PROJECTS}
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
                aria-label="Podgląd całości"
                onClick={() => setShowPreviewModal(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Podgląd całości
              </Button>
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

        <ScrollArea className="min-h-0 flex-1 overflow-hidden">
        <form id="project-edit-form" onSubmit={handleSave} className="space-y-8 pr-4">
          <ProjectEditBasic
            formData={form.formData}
            setFormData={form.setFormData}
            projectId={projectId}
            existingImagePaths={storageImagePaths}
            onImageUpload={onImageUpload}
            onImageDelete={onImageDelete}
            fieldErrors={{
              title: form.errors.title,
              shortDescription: form.errors.shortDescription,
            }}
          />
          <ProjectEditStack
            formData={form.formData}
            techInput={form.techInput}
            setTechInput={form.setTechInput}
            onAddTechnology={form.handleAddTechnology}
            onRemoveTechnology={form.handleRemoveTechnology}
            error={form.errors.technologies}
          />
          <ProjectEditLinks
            formData={form.formData}
            setFormData={form.setFormData}
            attachmentPool={attachmentPool}
            existingAttachments={existingAttachments}
            onAttachmentToggle={onAttachmentToggle}
            fieldErrors={{
              githubUrl: form.errors.githubUrl,
              demoUrl: form.errors.demoUrl,
            }}
          />
          <ProjectEditAttachments
            fileInputRef={fileInputRef}
            uploading={uploading}
            onFileAttach={onFileAttach}
          />
          <ProjectEditFullDescription
            projectId={projectId}
            blocks={form.formData.fullDescriptionBlocks}
            addBlock={form.addBlock}
            removeBlock={form.removeBlock}
            moveBlock={form.moveBlock}
            updateBlock={form.updateBlock}
            existingAttachments={existingAttachments}
            existingImagePaths={storageImagePaths}
            onStorageImageDeleted={onStorageImageDeleted}
            onStorageImageUploaded={onStorageImageUploaded}
            blockErrors={form.errors.fullDescriptionBlocks}
          />

          <div className="flex gap-4">
            <Link
              to={ADMIN_PROJECTS}
              className="flex-1 rounded-lg border-2 border-border px-6 py-3 text-center font-medium text-foreground transition-colors hover:bg-card"
            >
              Anuluj
            </Link>
          </div>
        </form>
        </ScrollArea>
      </div>

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

      <ProjectPreviewModal
        open={showPreviewModal}
        onOpenChange={setShowPreviewModal}
        previewProject={previewProject}
      />
    </AdminPageContainer>
  )
}
