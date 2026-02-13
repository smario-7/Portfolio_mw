import type { ContentData } from '@/lib/types/content'
import { apiRequest } from './client'

export async function getContent(): Promise<ContentData> {
  return apiRequest<ContentData>('/api/content')
}

export async function saveContent(data: ContentData): Promise<void> {
  await apiRequest<void>('/api/content', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
