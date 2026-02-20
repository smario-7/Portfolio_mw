import type { Project } from '@/lib/types'
import {
  getProjects as getProjectsApi,
  getProjectById as getProjectByIdApi,
  createProject as createProjectApi,
  updateProject as updateProjectApi,
  deleteProject as deleteProjectApi,
  saveProjects as saveProjectsApi,
} from '@/lib/api/projects-api'
import { supabase } from '@/lib/supabase/client'
import { TOOLS_CATALOG } from '@/lib/data/tools-catalog'
import type { ToolItem } from '@/lib/types/content'
import { normalizeProject, type RawProject } from '@/lib/data/project-normalize'

function normalizeProjects(list: RawProject[]): Project[] {
  return list.map(normalizeProject)
}

export async function loadProjects(): Promise<Project[]> {
  const data = await getProjectsApi()
  const list = Array.isArray(data) ? (data as RawProject[]) : []
  return normalizeProjects(list)
}

/** Tylko dla fallbacku Express. Przy Supabase nie używane – zapis przez createProject/updateProject/deleteProject. */
export async function saveProjects(list: Project[]): Promise<void> {
  if (supabase != null) return
  await saveProjectsApi(list)
}

export async function createProject(payload?: Partial<Project>): Promise<Project> {
  const created = await createProjectApi(payload)
  return normalizeProject(created as RawProject)
}

export async function getProjectById(id: number): Promise<Project> {
  const raw = await getProjectByIdApi(id)
  return normalizeProject(raw as RawProject)
}

export async function updateProject(id: number, patch: Partial<Project>): Promise<Project> {
  const updated = await updateProjectApi(id, patch)
  return normalizeProject(updated as RawProject)
}

export async function deleteProject(id: number): Promise<void> {
  await deleteProjectApi(id)
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
