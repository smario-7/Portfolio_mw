import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { Sidebar } from '@/components/admin/sidebar'
import { ProjectsTable } from '@/components/admin/projects-table'

export default function AdminProjects() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Projekty</h1>
            <p className="text-muted-foreground">Zarządzaj swoimi projektami</p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Szukaj projektów..."
                className="w-full rounded-lg border border-border bg-background px-4 py-2 pl-10 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <Link href="/admin/projects/new" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90">
              <Plus className="h-5 w-5" />
              Nowy projekt
            </Link>
          </div>

          <ProjectsTable />
        </div>
      </main>
    </div>
  )
}
