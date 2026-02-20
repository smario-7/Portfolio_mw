import { supabase } from '@/lib/supabase/client'

export async function recordPageView(page: string = 'home'): Promise<void> {
  const client = supabase
  if (!client) return
  await client.from('page_views').insert({ page })
}

export async function getPageViewCount(page?: string): Promise<number> {
  const client = supabase
  if (!client) return 0
  let query = client.from('page_views').select('*', { count: 'exact', head: true })
  if (page) {
    query = query.eq('page', page)
  }
  const { count, error } = await query
  if (error) throw new Error(error.message)
  return count ?? 0
}

export interface RecentPageView {
  viewed_at: string
}

export async function getRecentPageViews(
  page: string = 'home',
  limit: number = 5
): Promise<RecentPageView[]> {
  const client = supabase
  if (!client) return []
  const { data, error } = await client
    .from('page_views')
    .select('viewed_at')
    .eq('page', page)
    .order('viewed_at', { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  return (data ?? []) as RecentPageView[]
}

export interface PageViewRecord {
  id: number
  viewed_at: string
}

export async function getAllPageViews(page: string = 'home'): Promise<PageViewRecord[]> {
  const client = supabase
  if (!client) return []
  const { data, error } = await client
    .from('page_views')
    .select('id, viewed_at')
    .eq('page', page)
    .order('viewed_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as PageViewRecord[]
}

export async function deletePageViewIds(ids: number[]): Promise<void> {
  const client = supabase
  if (!client || ids.length === 0) return
  const { error } = await client.from('page_views').delete().in('id', ids)
  if (error) throw new Error(error.message)
}
