import type { Project } from '@/lib/types'
import { getProjects as getProjectsApi, saveProjects as saveProjectsApi } from '@/lib/api/projects-api'
import { loadProjects as loadProjectsStorage, saveProjects as saveProjectsStorage } from '@/lib/data/store'
import { TOOLS_CATALOG } from '@/lib/data/tools-catalog'
import type { ToolItem } from '@/lib/types/content'

export async function loadProjects(): Promise<Project[]> {
  try {
    const data = await getProjectsApi()
    saveProjectsStorage(data)
    return data
  } catch {
    return loadProjectsStorage()
  }
}

export async function saveProjects(list: Project[]): Promise<void> {
  try {
    await saveProjectsApi(list)
    saveProjectsStorage(list)
  } catch {
    saveProjectsStorage(list)
    throw new Error('Zapis do pliku nie powiódł się, dane tylko w tej sesji')
  }
}

export function getProjectFilters(list: Project[]): string[] {
  if (list.length === 0) return []
  const categories = [...new Set(list.map((p) => p.category))].sort()
  return ['Wszystkie', ...categories]
}

export function getToolsCatalog(): ToolItem[] {
  return TOOLS_CATALOG
}

export function nextProjectId(projects: Project[]): number {
  if (projects.length === 0) return 1
  return Math.max(...projects.map((p) => p.id), 0) + 1
}
