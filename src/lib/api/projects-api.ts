import type { Project } from '@/lib/types'
import { supabase } from '@/lib/supabase/client'
import * as projectsRepository from '@/lib/supabase/repositories/projects.repository'
import {
  projectToProjectsInsert,
  projectToProjectsUpdate,
} from '@/lib/supabase/types'
import { apiRequest } from '@/lib/api/client'

export async function getProjects(): Promise<Project[]> {
  if (supabase != null) {
    return projectsRepository.list()
  }
  const data = await apiRequest<Project[]>('/api/projects')
  return Array.isArray(data) ? data : []
}

export async function getProjectById(id: number): Promise<Project> {
  if (supabase != null) {
    return projectsRepository.getById(id)
  }
  const data = await apiRequest<Project>(`/api/projects/${id}`)
  return data as Project
}

export async function getProjectsLastUpdatedAt(): Promise<string | null> {
  if (supabase == null) return null
  return projectsRepository.getLastUpdatedAt()
}

export async function createProject(payload?: Partial<Project>): Promise<Project> {
  if (supabase != null) {
    const order =
      payload?.order !== undefined
        ? payload.order
        : await projectsRepository.getNextOrder()
    const insert = projectToProjectsInsert({
      ...payload,
      category: payload?.category ?? 'Frontend',
      title: payload?.title ?? '',
      description: payload?.description ?? '',
      github: payload?.github ?? '',
      demo: payload?.demo ?? '',
      stack: payload?.stack ?? [],
      fullDescription: payload?.fullDescription ?? [],
      attachments: payload?.attachments ?? [],
      order,
      status: payload?.status ?? 'draft',
      featured: payload?.featured ?? false,
    })
    return projectsRepository.create(insert)
  }
  const data = await apiRequest<Project>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(payload ?? {}),
  })
  return data as Project
}

export async function updateProject(id: number, patch: Partial<Project>): Promise<Project> {
  if (supabase != null) {
    const update = projectToProjectsUpdate(patch)
    return projectsRepository.update(id, update)
  }
  const data = await apiRequest<Project>(`/api/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
  return data as Project
}

export async function deleteProject(id: number): Promise<void> {
  if (supabase != null) {
    await projectsRepository.delete(id)
    return
  }
  await apiRequest(`/api/projects/${id}`, { method: 'DELETE' })
}

/** Tylko dla Express. Przy Supabase nieużywane – zapis przez create/update/delete. */
export async function saveProjects(list: Project[]): Promise<void> {
  if (supabase != null) {
    throw new Error('saveProjects nie jest używane przy Supabase; używaj create/update/delete')
  }
  await apiRequest('/api/projects', {
    method: 'POST',
    body: JSON.stringify(list),
  })
}
