import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2, GripVertical, Palette } from 'lucide-react'
import { toast } from 'sonner'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { ColorPickerModal } from '@/components/admin/ColorPickerModal'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
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
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Project } from '@/lib/types'

function formatStack(stack: string[], max = 3): string {
  if (!stack?.length) return '—'
  const slice = stack.slice(0, max)
  return stack.length > max ? `${slice.join(', ')}…` : slice.join(', ')
}

interface SortableRowProps {
  project: Project
  selectedIds: Set<number>
  deleteId: number | null
  onToggleSelect: (id: number, checked: boolean) => void
  onSetDeleteId: (id: number) => void
}

function SortableRow({
  project,
  selectedIds,
  deleteId: _deleteId,
  onToggleSelect,
  onSetDeleteId,
}: SortableRowProps) {
  const { updateProject } = usePortfolio()
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleColorSelect = async (color: string | undefined) => {
    try {
      await updateProject(project.id, { color: color ?? null })
      toast.success('Kolor zmieniony')
      setColorPickerOpen(false)
    } catch {
      toast.error('Nie udało się zmienić koloru')
    }
  }

  const isPublished = project.status === 'published'
  const handlePublishedChange = async (checked: boolean | 'indeterminate') => {
    const newStatus = checked === true ? 'published' : 'draft'
    try {
      await updateProject(project.id, { status: newStatus })
      toast.success(newStatus === 'published' ? 'Projekt opublikowany' : 'Projekt ustawiony jako szkic')
    } catch {
      toast.error('Nie udało się zmienić statusu')
    }
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`transition-colors hover:bg-card/80 ${isDragging ? 'cursor-grabbing shadow-md ring-2 ring-primary/20' : ''}`}
    >
      <td className="w-12 px-4 py-4">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Przeciągnij aby zmienić kolejność"
        >
          <GripVertical className="h-5 w-5" />
        </button>
      </td>
      <td className="w-12 px-4 py-4">
        <Checkbox
          checked={selectedIds.has(project.id)}
          onCheckedChange={(checked) =>
            onToggleSelect(project.id, checked === true)
          }
          aria-label={`Zaznacz ${project.title}`}
        />
      </td>
      <td className="px-6 py-4 text-sm text-foreground">
        {project.title}
      </td>
      <td className="px-6 py-4 text-sm">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {project.category}
        </span>
      </td>
      <td className="w-14 px-4 py-4 text-center">
        <Checkbox
          checked={isPublished}
          onCheckedChange={handlePublishedChange}
          className="size-3.5 mx-auto rounded-[3px]"
          aria-label={isPublished ? 'Opublikowany – kliknij, aby ustawić jako szkic' : 'Szkic – kliknij, aby opublikować'}
        />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'size-8 shrink-0 rounded border-2 border-border bg-gradient-to-br',
              project.color?.trim()
                ? project.color
                : 'from-primary/20 via-accent/10 to-transparent'
            )}
            aria-hidden
          />
          <button
            type="button"
            onClick={() => setColorPickerOpen(true)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            aria-label="Zmień kolor karty"
          >
            <Palette className="h-4 w-4" />
          </button>
        </div>
        <ColorPickerModal
          open={colorPickerOpen}
          onOpenChange={setColorPickerOpen}
          value={project.color?.trim() || undefined}
          onSelect={handleColorSelect}
        />
      </td>
      <td className="px-6 py-4 text-sm text-muted-foreground">
        {formatStack(project.stack)}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/admin/projects/${project.id}`}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            aria-label="Edytuj projekt"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => onSetDeleteId(project.id)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Usuń projekt"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export function ProjectsTable() {
  const { projects, deleteProject, setProjects } = usePortfolio()
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [showBulkDelete, setShowBulkDelete] = useState(false)
  const projectToDelete =
    deleteId != null ? projects.find((p) => p.id === deleteId) : null

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setProjects((prevProjects) => {
        const oldIndex = prevProjects.findIndex((p) => p.id === active.id)
        const newIndex = prevProjects.findIndex((p) => p.id === over.id)

        const reorderedProjects = arrayMove(prevProjects, oldIndex, newIndex)

        const updatedProjects = reorderedProjects.map((project, index) => ({
          ...project,
          order: index + 1,
        }))

        return updatedProjects
      })

      toast.success('Kolejność projektów została zmieniona')
    }
  }

  const allSelected =
    projects.length > 0 && selectedIds.size === projects.length
  const someSelected = selectedIds.size > 0

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(projects.map((p) => p.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const toggleSelect = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const handleConfirmDelete = () => {
    if (deleteId == null) return
    deleteProject(deleteId)
    setDeleteId(null)
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(deleteId)
      return next
    })
    toast.success('Projekt usunięty')
  }

  const handleConfirmBulkDelete = () => {
    selectedIds.forEach((id) => deleteProject(id))
    setSelectedIds(new Set())
    setShowBulkDelete(false)
    toast.success(`Usunięto ${selectedIds.size} projektów`)
  }

  return (
    <>
      {someSelected && (
        <div className="mb-4 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Zaznaczono: {selectedIds.size}
          </span>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setShowBulkDelete(true)}
          >
            Usuń zaznaczone
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSelectedIds(new Set())}
          >
            Odznacz wszystkie
          </Button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="min-w-0">
          <table className="w-full">
            <thead className="sticky top-0 z-10 border-b-2 border-border bg-card/80 backdrop-blur-sm">
              <tr>
                <th className="w-12 px-4 py-4"></th>
                <th className="w-12 px-4 py-4">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) =>
                      toggleSelectAll(checked === true)
                    }
                    aria-label="Zaznacz wszystkie"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Tytuł
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Kategoria
                </th>
                <th className="w-14 px-4 py-4 text-center text-sm font-semibold text-foreground">
                  Opublikowany
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">
                  Kolor
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Stack
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                  Akcje
                </th>
              </tr>
            </thead>
            <SortableContext
              items={projects.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <tbody className="divide-y-2 divide-border">
                {projects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      Nie dodano jeszcze żadnych projektów.
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <SortableRow
                      key={project.id}
                      project={project}
                      selectedIds={selectedIds}
                      deleteId={deleteId}
                      onToggleSelect={toggleSelect}
                      onSetDeleteId={setDeleteId}
                    />
                  ))
                )}
              </tbody>
            </SortableContext>
          </table>
        </div>
      </DndContext>

      <AlertDialog
        open={deleteId != null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno usunąć projekt?</AlertDialogTitle>
            <AlertDialogDescription>
              {projectToDelete
                ? `Projekt „${projectToDelete.title}” zostanie trwale usunięty.`
                : 'Ta operacja jest nieodwracalna.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showBulkDelete}
        onOpenChange={setShowBulkDelete}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć zaznaczone projekty?</AlertDialogTitle>
            <AlertDialogDescription>
              Zostanie trwale usuniętych {selectedIds.size} projektów. Tej
              operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Usuń {selectedIds.size}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
