import * as storageService from '@/lib/services/storage-service'
import * as contentService from '@/lib/services/content-service'
import * as projectsService from '@/lib/services/projects-service'
import * as pageViewsService from '@/lib/services/page-views-service'

export interface DashboardStats {
  fileCount: number
  lastUpdatedAt: string | null
  viewCount: number
  recentViews: { viewed_at: string }[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [fileCount, contentDate, projectsDate, viewCount, recentViews] = await Promise.all([
    storageService.countAllStorageFiles(),
    contentService.getContentLastUpdatedAt(),
    projectsService.getProjectsLastUpdatedAt(),
    pageViewsService.getPageViewCount('home'),
    pageViewsService.getRecentPageViews('home', 5),
  ])

  const dates = [contentDate, projectsDate].filter(
    (d): d is string => d != null && d !== ''
  )
  const lastUpdatedAt =
    dates.length === 0 ? null : dates.sort((a, b) => b.localeCompare(a))[0]

  return {
    fileCount,
    lastUpdatedAt,
    viewCount,
    recentViews,
  }
}
