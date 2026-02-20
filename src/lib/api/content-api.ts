import type { ContentData } from '@/lib/types/content'
import { apiRequest } from '@/lib/api/client'
import { supabase } from '@/lib/supabase/client'
import * as contentRepository from '@/lib/supabase/repositories/content.repository'

export async function getContent(): Promise<ContentData> {
  if (supabase != null) {
    return contentRepository.getContent()
  }
  return apiRequest<ContentData>('/api/content')
}

export async function getContentLastUpdatedAt(): Promise<string | null> {
  if (supabase == null) return null
  return contentRepository.getContentUpdatedAt()
}

export async function saveContent(data: ContentData): Promise<void> {
  if (supabase != null) {
    await contentRepository.saveContent(data)
    return
  }
  await apiRequest('/api/content', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
