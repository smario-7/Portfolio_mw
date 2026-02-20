import { useNavigate } from 'react-router-dom'
import { Plus, Search, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { AdminPageContainer } from '@/components/admin/AdminPageContainer'
import { ProjectsTable } from '@/components/admin/ProjectsTable'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AdminProjects() {
  const navigate = useNavigate()
  const { createProject } = usePortfolio()
  const [creating, setCreating] = useState(false)

  const handleNewProject = async () => {
    setCreating(true)
    try {
      const project = await createProject()
      navigate(`/admin/projects/${project.id}`)
    } catch {
      toast.error('Nie udało się utworzyć projektu.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <AdminPageContainer>
      <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-hidden">
        <div className="shrink-0">
        <h1 className="text-4xl font-bold text-foreground">Projekty</h1>
        <p className="text-muted-foreground">Zarządzaj swoimi projektami</p>
      </div>

      <div className="flex shrink-0 gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Szukaj projektów..."
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 pl-10 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <Button
          onClick={handleNewProject}
          disabled={creating}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {creating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
          Nowy projekt
        </Button>
      </div>

        <div className="flex min-h-0 flex-1 flex-col rounded-lg border-2 border-border bg-card/50 overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-4">
            <ProjectsTable />
          </div>
        </div>
      </div>
    </AdminPageContainer>
  )
}
