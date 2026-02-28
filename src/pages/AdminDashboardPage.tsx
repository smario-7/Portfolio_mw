import { useCallback, useEffect, useState } from 'react'
import { LayoutDashboard, FileText, User, ImageIcon, Eye } from 'lucide-react'
import { AdminPageContainer } from '@/components/admin/AdminPageContainer'
import { AdminSectionCard } from '@/components/admin/AdminSectionCard'
import { StatCard } from '@/components/admin/StatCard'
import { VisitsModal } from '@/components/admin/dashboard'
import { useProjects } from '@/contexts/PortfolioContext'
import { getDashboardStats } from '@/lib/services/dashboard-service'
import { formatRelativeDate } from '@/lib/utils/format-relative-date'
import { reportError } from '@/lib/errors'

export default function AdminDashboard() {
  const { projects, loading } = useProjects()
  const [fileCount, setFileCount] = useState<number | null>(null)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null)
  const [viewCount, setViewCount] = useState<number | null>(null)
  const [recentViews, setRecentViews] = useState<{ viewed_at: string }[]>([])
  const [visitsModalOpen, setVisitsModalOpen] = useState(false)
  const totalProjects = projects.length
  const publishedCount = projects.filter((p) => p.status === 'published').length

  const loadStats = useCallback(() => {
    getDashboardStats()
      .then((stats) => {
        setFileCount(stats.fileCount)
        setLastUpdatedAt(stats.lastUpdatedAt)
        setViewCount(stats.viewCount)
        setRecentViews(stats.recentViews)
      })
      .catch((err) => {
        reportError(err, { context: 'dashboard_load_stats' })
        setFileCount(0)
        setLastUpdatedAt(null)
        setViewCount(null)
        setRecentViews([])
      })
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const refreshVisits = useCallback(() => {
    loadStats()
  }, [loadStats])

  return (
    <AdminPageContainer>
      <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto">
        <div className="shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Zarządzaj swoim portfolio</p>
          </div>
        </div>

        <div className="grid shrink-0 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Odwiedziny (strona główna)"
          value={viewCount === null ? '—' : String(viewCount)}
          icon={Eye}
          color="bg-amber-500/10"
          onClick={() => setVisitsModalOpen(true)}
        />
        <StatCard
          label="Liczba projektów"
          value={loading ? '—' : String(totalProjects)}
          icon={FileText}
          color="bg-blue-500/10"
        />
        <StatCard
          label="Ilość opublikowanych"
          value={loading ? '—' : String(publishedCount)}
          icon={LayoutDashboard}
          color="bg-purple-500/10"
        />
        <StatCard
          label="Liczba plików"
          value={fileCount === null ? '—' : String(fileCount)}
          icon={ImageIcon}
          color="bg-pink-500/10"
        />
        <StatCard
          label="Ostatnia aktualizacja"
          value={
            lastUpdatedAt === null
              ? '—'
              : formatRelativeDate(lastUpdatedAt)
          }
          icon={User}
          color="bg-green-500/10"
        />
      </div>

        {recentViews.length > 0 && (
          <AdminSectionCard title="Ostatnie 5 odwiedzin (strona główna)">
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {recentViews.map((v, i) => (
                <li key={i}>
                  {formatRelativeDate(v.viewed_at)}
                </li>
              ))}
            </ul>
          </AdminSectionCard>
        )}

        <VisitsModal
          open={visitsModalOpen}
          onOpenChange={(open) => {
            setVisitsModalOpen(open)
            if (!open) refreshVisits()
          }}
          onDataChange={refreshVisits}
        />
      </div>
    </AdminPageContainer>
  )
}
