'use client'

import { LayoutDashboard, FileText, User, ImageIcon, Plus } from 'lucide-react'
import { Sidebar } from '@/components/admin/sidebar'
import { StatCard } from '@/components/admin/stat-card'
import { ProjectsTable } from '@/components/admin/projects-table'

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Zarządzaj swoim portfolio</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Liczba projektów"
              value="12"
              icon={FileText}
              color="bg-blue-500/10"
            />
            <StatCard
              label="Wyróżnione projekty"
              value="5"
              icon={LayoutDashboard}
              color="bg-purple-500/10"
            />
            <StatCard
              label="Liczba plików"
              value="48"
              icon={ImageIcon}
              color="bg-pink-500/10"
            />
            <StatCard
              label="Ostatnia aktualizacja"
              value="2 dni temu"
              icon={User}
              color="bg-green-500/10"
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Projekty</h2>
                <p className="text-sm text-muted-foreground">Zarządzaj swoimi projektami</p>
              </div>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90">
                <Plus className="h-5 w-5" />
                Dodaj projekt
              </button>
            </div>

            <ProjectsTable />
          </div>
        </div>
      </main>
    </div>
  )
}
