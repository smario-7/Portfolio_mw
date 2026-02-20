import type { ContentData } from '@/lib/types'
import { getContent as getContentApi, saveContent as saveContentApi } from '@/lib/api/content-api'

export async function loadContent(): Promise<ContentData> {
  return getContentApi()
}

export async function saveContent(data: ContentData): Promise<void> {
  await saveContentApi(data)
}

export function hasAboutContent(content: ContentData): boolean {
  const about = content.about
  if (!about) return false
  if ((about.introduction ?? '').trim() !== '') return true
  if ((about.courses?.length ?? 0) > 0) return true
  const hasNonEmptySkills = Object.values(about.skills ?? {}).some(
    (arr) => (arr?.length ?? 0) > 0
  )
  if (hasNonEmptySkills) return true
  if ((about.tools?.length ?? 0) > 0) return true
  return false
}

export function hasContactContent(content: ContentData): boolean {
  const contact = content.contact
  if (!contact) return false
  if ((contact.links?.length ?? 0) > 0) return true
  if ((contact.email ?? '').trim() !== '') return true
  if ((contact.phone ?? '').trim() !== '') return true
  return false
}
