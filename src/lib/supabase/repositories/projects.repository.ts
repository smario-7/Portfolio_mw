import { supabase } from '@/lib/supabase/client'
import type { ProjectsInsert, ProjectsUpdate } from '@/lib/supabase/types'
import { projectRowToProject } from '@/lib/supabase/types'

function getClient() {
  if (!supabase) {
    throw new Error(
      'Skonfiguruj Supabase (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)'
    )
  }
  return supabase
}

export async function getNextOrder(): Promise<number> {
  const client = getClient()
  const { data, error } = await client
    .from('projects')
    .select('order')
    .order('order', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (data == null) return 0
  return data.order + 1
}

export async function getLastUpdatedAt(): Promise<string | null> {
  const client = getClient()
  const { data, error } = await client
    .from('projects')
    .select('updated_at')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data?.updated_at ?? null
}

export async function list() {
  const client = getClient()
  const { data, error } = await client
    .from('projects')
    .select('*')
    .order('order', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map(projectRowToProject)
}

export async function getById(id: number) {
  const client = getClient()
  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw new Error(error.message)
  return projectRowToProject(data)
}

export async function create(payload: ProjectsInsert) {
  const client = getClient()
  const { data, error } = await client
    .from('projects')
    .insert(payload)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return projectRowToProject(data)
}

export async function update(id: number, payload: ProjectsUpdate) {
  const client = getClient()
  const { data, error } = await client
    .from('projects')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return projectRowToProject(data)
}

async function deleteProject(id: number) {
  const client = getClient()
  const { error } = await client.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export { deleteProject as delete }
