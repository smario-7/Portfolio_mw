import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  recordPageView,
  getPageViewCount,
  getRecentPageViews,
  getAllPageViews,
  deletePageViewIds,
} from '@/lib/services/page-views-service'
import * as pageViewsApi from '@/lib/api/page-views-api'

vi.mock('@/lib/api/page-views-api', () => ({
  recordPageView: vi.fn(),
  getPageViewCount: vi.fn(),
  getRecentPageViews: vi.fn(),
  getAllPageViews: vi.fn(),
  deletePageViewIds: vi.fn(),
}))

describe('page-views-service', () => {
  beforeEach(() => {
    vi.mocked(pageViewsApi.recordPageView).mockReset()
    vi.mocked(pageViewsApi.getPageViewCount).mockReset()
    vi.mocked(pageViewsApi.getRecentPageViews).mockReset()
    vi.mocked(pageViewsApi.getAllPageViews).mockReset()
    vi.mocked(pageViewsApi.deletePageViewIds).mockReset()
  })

  describe('recordPageView', () => {
    it('calls API with default page "home"', async () => {
      vi.mocked(pageViewsApi.recordPageView).mockResolvedValue(undefined)
      await recordPageView()
      expect(pageViewsApi.recordPageView).toHaveBeenCalledTimes(1)
      expect(pageViewsApi.recordPageView).toHaveBeenCalledWith('home')
    })

    it('calls API with given page', async () => {
      vi.mocked(pageViewsApi.recordPageView).mockResolvedValue(undefined)
      await recordPageView('about')
      expect(pageViewsApi.recordPageView).toHaveBeenCalledWith('about')
    })
  })

  describe('getPageViewCount', () => {
    it('returns count from API', async () => {
      vi.mocked(pageViewsApi.getPageViewCount).mockResolvedValue(42)
      const result = await getPageViewCount()
      expect(pageViewsApi.getPageViewCount).toHaveBeenCalledTimes(1)
      expect(result).toBe(42)
    })

    it('calls API with page when provided', async () => {
      vi.mocked(pageViewsApi.getPageViewCount).mockResolvedValue(10)
      await getPageViewCount('projects')
      expect(pageViewsApi.getPageViewCount).toHaveBeenCalledWith('projects')
    })
  })

  describe('getRecentPageViews', () => {
    it('returns recent views from API with default page and limit', async () => {
      const views = [{ viewed_at: '2025-01-01T12:00:00Z' }]
      vi.mocked(pageViewsApi.getRecentPageViews).mockResolvedValue(views)
      const result = await getRecentPageViews()
      expect(pageViewsApi.getRecentPageViews).toHaveBeenCalledWith('home', 5)
      expect(result).toEqual(views)
    })

    it('calls API with given page and limit', async () => {
      vi.mocked(pageViewsApi.getRecentPageViews).mockResolvedValue([])
      await getRecentPageViews('contact', 3)
      expect(pageViewsApi.getRecentPageViews).toHaveBeenCalledWith('contact', 3)
    })
  })

  describe('getAllPageViews', () => {
    it('returns all page views from API', async () => {
      const records = [
        { id: 1, viewed_at: '2025-01-01T12:00:00Z' },
        { id: 2, viewed_at: '2025-01-02T12:00:00Z' },
      ]
      vi.mocked(pageViewsApi.getAllPageViews).mockResolvedValue(records)
      const result = await getAllPageViews()
      expect(pageViewsApi.getAllPageViews).toHaveBeenCalledWith('home')
      expect(result).toEqual(records)
    })
  })

  describe('deletePageViewIds', () => {
    it('calls API with given ids', async () => {
      vi.mocked(pageViewsApi.deletePageViewIds).mockResolvedValue(undefined)
      await deletePageViewIds([1, 2, 3])
      expect(pageViewsApi.deletePageViewIds).toHaveBeenCalledTimes(1)
      expect(pageViewsApi.deletePageViewIds).toHaveBeenCalledWith([1, 2, 3])
    })
  })
})
