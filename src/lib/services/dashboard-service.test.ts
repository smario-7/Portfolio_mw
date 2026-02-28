import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getDashboardStats } from '@/lib/services/dashboard-service'
import * as storageService from '@/lib/services/storage-service'
import * as contentService from '@/lib/services/content-service'
import * as projectsService from '@/lib/services/projects-service'
import * as pageViewsService from '@/lib/services/page-views-service'

vi.mock('@/lib/services/storage-service', () => ({
  countAllStorageFiles: vi.fn(),
}))
vi.mock('@/lib/services/content-service', () => ({
  getContentLastUpdatedAt: vi.fn(),
}))
vi.mock('@/lib/services/projects-service', () => ({
  getProjectsLastUpdatedAt: vi.fn(),
}))
vi.mock('@/lib/services/page-views-service', () => ({
  getPageViewCount: vi.fn(),
  getRecentPageViews: vi.fn(),
}))

describe('dashboard-service', () => {
  beforeEach(() => {
    vi.mocked(storageService.countAllStorageFiles).mockResolvedValue(0)
    vi.mocked(contentService.getContentLastUpdatedAt).mockResolvedValue(null)
    vi.mocked(projectsService.getProjectsLastUpdatedAt).mockResolvedValue(null)
    vi.mocked(pageViewsService.getPageViewCount).mockResolvedValue(0)
    vi.mocked(pageViewsService.getRecentPageViews).mockResolvedValue([])
  })

  it('calls all dependent services and returns combined stats', async () => {
    vi.mocked(storageService.countAllStorageFiles).mockResolvedValue(5)
    vi.mocked(contentService.getContentLastUpdatedAt).mockResolvedValue('2025-01-15T10:00:00Z')
    vi.mocked(projectsService.getProjectsLastUpdatedAt).mockResolvedValue('2025-01-10T10:00:00Z')
    vi.mocked(pageViewsService.getPageViewCount).mockResolvedValue(100)
    vi.mocked(pageViewsService.getRecentPageViews).mockResolvedValue([
      { viewed_at: '2025-01-20T12:00:00Z' },
    ])

    const result = await getDashboardStats()

    expect(storageService.countAllStorageFiles).toHaveBeenCalledTimes(1)
    expect(contentService.getContentLastUpdatedAt).toHaveBeenCalledTimes(1)
    expect(projectsService.getProjectsLastUpdatedAt).toHaveBeenCalledTimes(1)
    expect(pageViewsService.getPageViewCount).toHaveBeenCalledWith('home')
    expect(pageViewsService.getRecentPageViews).toHaveBeenCalledWith('home', 5)

    expect(result.fileCount).toBe(5)
    expect(result.viewCount).toBe(100)
    expect(result.recentViews).toEqual([{ viewed_at: '2025-01-20T12:00:00Z' }])
    expect(result.lastUpdatedAt).toBe('2025-01-15T10:00:00Z')
  })

  it('sets lastUpdatedAt to null when both content and projects dates are null', async () => {
    vi.mocked(contentService.getContentLastUpdatedAt).mockResolvedValue(null)
    vi.mocked(projectsService.getProjectsLastUpdatedAt).mockResolvedValue(null)

    const result = await getDashboardStats()

    expect(result.lastUpdatedAt).toBeNull()
  })

  it('sets lastUpdatedAt to null when both dates are empty string', async () => {
    vi.mocked(contentService.getContentLastUpdatedAt).mockResolvedValue('')
    vi.mocked(projectsService.getProjectsLastUpdatedAt).mockResolvedValue('')

    const result = await getDashboardStats()

    expect(result.lastUpdatedAt).toBeNull()
  })

  it('uses projects date when content date is null', async () => {
    vi.mocked(contentService.getContentLastUpdatedAt).mockResolvedValue(null)
    vi.mocked(projectsService.getProjectsLastUpdatedAt).mockResolvedValue('2025-01-01T00:00:00Z')

    const result = await getDashboardStats()

    expect(result.lastUpdatedAt).toBe('2025-01-01T00:00:00Z')
  })

  it('uses the later date when both are set', async () => {
    vi.mocked(contentService.getContentLastUpdatedAt).mockResolvedValue('2025-01-01T00:00:00Z')
    vi.mocked(projectsService.getProjectsLastUpdatedAt).mockResolvedValue('2025-02-01T00:00:00Z')

    const result = await getDashboardStats()

    expect(result.lastUpdatedAt).toBe('2025-02-01T00:00:00Z')
  })
})
