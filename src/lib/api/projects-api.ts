import type { Project } from '@/lib/types'
import { apiRequest } from './client'

export async function getProjects(): Promise<Project[]> {
  return apiRequest<Project[]>('/api/projects')
}

export async function saveProjects(list: Project[]): Promise<void> {
  await apiRequest<void>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(list),
  })
}
