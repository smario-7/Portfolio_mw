import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { usePortfolio } from '@/contexts/PortfolioContext'
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

function formatStack(stack: string[], max = 3): string {
  if (!stack?.length) return '—'
  const slice = stack.slice(0, max)
  return stack.length > max ? `${slice.join(', ')}…` : slice.join(', ')
}

export function ProjectsTable() {
  const { projects, deleteProject } = usePortfolio()
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [showBulkDelete, setShowBulkDelete] = useState(false)
  const projectToDelete =
    deleteId != null ? projects.find((p) => p.id === deleteId) : null

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

      <div className="overflow-x-auto rounded-lg border-2 border-border bg-card/50 backdrop-blur-sm">
        <table className="w-full">
          <thead className="border-b-2 border-border bg-card/80">
            <tr>
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
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Stack
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border">
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-muted-foreground"
                >
                  Nie dodano jeszcze żadnych projektów.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr
                  key={project.id}
                  className="transition-colors hover:bg-card/80"
                >
                  <td className="w-12 px-4 py-4">
                    <Checkbox
                      checked={selectedIds.has(project.id)}
                      onCheckedChange={(checked) =>
                        toggleSelect(project.id, checked === true)
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
                        onClick={() => setDeleteId(project.id)}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Usuń projekt"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
