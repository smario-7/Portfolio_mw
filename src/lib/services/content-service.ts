import type { ContentData } from '@/lib/types/content'
import { getContent as getContentApi, saveContent as saveContentApi } from '@/lib/api/content-api'
import { loadContent as loadContentStorage, saveContent as saveContentStorage } from '@/lib/data/store'

export async function loadContent(): Promise<ContentData> {
  try {
    const data = await getContentApi()
    saveContentStorage(data)
    return data
  } catch {
    return loadContentStorage()
  }
}

export async function saveContent(data: ContentData): Promise<void> {
  try {
    await saveContentApi(data)
    saveContentStorage(data)
  } catch {
    saveContentStorage(data)
    throw new Error('Zapis do pliku nie powiódł się, dane tylko w tej sesji')
  }
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
