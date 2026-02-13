import { LayoutDashboard, FileText, User, ImageIcon } from 'lucide-react'
import { StatCard } from '@/components/admin/stat-card'

export default function AdminDashboard() {
  return (
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
    </div>
  )
}
