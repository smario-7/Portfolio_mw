import type { ContentData } from '@/lib/types/content'
import type { Project } from '@/lib/types'
import { DEFAULT_CONTENT } from './content-defaults'
import { projects as defaultProjects } from './projects'

const STORAGE_KEY_CONTENT = 'portfolio-content'
const STORAGE_KEY_PROJECTS = 'portfolio-projects'

export function clearLegacyLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CONTENT)
    localStorage.removeItem(STORAGE_KEY_PROJECTS)
  } catch {
    // ignore
  }
}

clearLegacyLocalStorage()

function safeParse<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function loadContent(): ContentData {
  return safeParse(STORAGE_KEY_CONTENT, DEFAULT_CONTENT)
}

export function loadProjects(): Project[] {
  return safeParse(STORAGE_KEY_PROJECTS, defaultProjects)
}

export function saveContent(data: ContentData): void {
  try {
    sessionStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export function saveProjects(list: Project[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(list))
  } catch {
    // ignore
  }
}
