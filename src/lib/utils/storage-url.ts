/**
 * Zwraca pełny URL do pliku w storage.
 * Przy włączonym Supabase – URL z bucketa project-files; w przeciwnym razie origin z VITE_API_URL.
 */

import { supabase } from '@/lib/supabase/client'

const apiBase =
  typeof import.meta.env.VITE_API_URL === 'string'
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : ''

export function getStorageBaseUrl(): string {
  if (supabase) {
    const publicUrl = supabase.storage.from('project-files').getPublicUrl('').data.publicUrl
    return publicUrl.replace(/\/$/, '')
  }
  if (!apiBase) return ''
  try {
    return new URL(apiBase).origin
  } catch {
    return ''
  }
}

export function getStorageFileUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path
  }
  const pathTrimmed = path.startsWith('/') ? path.slice(1) : path
  if (supabase && pathTrimmed.startsWith('projects/')) {
    return supabase.storage.from('project-files').getPublicUrl(pathTrimmed).data.publicUrl
  }
  const normalized = path.startsWith('/') ? path : `/${path}`
  let origin = ''
  if (supabase && apiBase) {
    try {
      origin = new URL(apiBase).origin
    } catch {
      // leave origin empty
    }
  } else if (!supabase) {
    origin = getStorageBaseUrl()
  }
  if (!origin) return normalized
  return `${origin}${normalized}`
}
