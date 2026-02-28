import {
  recordPageView as recordPageViewApi,
  getPageViewCount as getPageViewCountApi,
  getRecentPageViews as getRecentPageViewsApi,
  getAllPageViews as getAllPageViewsApi,
  deletePageViewIds as deletePageViewIdsApi,
} from '@/lib/api/page-views-api'

export type { PageViewRecord, RecentPageView } from '@/lib/api/page-views-api'

export async function recordPageView(page: string = 'home'): Promise<void> {
  return recordPageViewApi(page)
}

export async function getPageViewCount(page?: string): Promise<number> {
  return getPageViewCountApi(page)
}

export async function getRecentPageViews(
  page: string = 'home',
  limit: number = 5
): Promise<{ viewed_at: string }[]> {
  return getRecentPageViewsApi(page, limit)
}

export async function getAllPageViews(page: string = 'home') {
  return getAllPageViewsApi(page)
}

export async function deletePageViewIds(ids: number[]): Promise<void> {
  return deletePageViewIdsApi(ids)
}
