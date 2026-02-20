import { getStorageFileUrl } from './storage-url'

const cache = new Map<string, string>()
const MAX_ENTRIES = 50

function evictOldest() {
  if (cache.size <= MAX_ENTRIES) return
  const firstKey = cache.keys().next().value
  if (firstKey !== undefined) cache.delete(firstKey)
}

export async function getCodeFileContent(sourceFile: string): Promise<string> {
  const cached = cache.get(sourceFile)
  if (cached !== undefined) return cached
  const url = getStorageFileUrl(sourceFile)
  const res = await fetch(url)
  if (!res.ok) throw new Error('Fetch failed')
  const text = await res.text()
  if (cache.size >= MAX_ENTRIES) evictOldest()
  cache.set(sourceFile, text)
  return text
}
