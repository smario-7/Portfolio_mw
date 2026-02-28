import { supabase } from '@/lib/supabase/client'
import { getProjectStorageBasePath } from '@/lib/constants/storage-paths'
import { apiRequest } from './client'

const BUCKET = 'project-files'

function safeFileName(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.')
  const base = lastDot >= 0 ? fileName.slice(0, lastDot) : fileName
  const ext = lastDot >= 0 ? fileName.slice(lastDot).toLowerCase() : ''
  const safeBase = base.replace(/[^a-zA-Z0-9_-]/g, '_')
  return safeBase + ext
}

function extensionToType(ext: string): string {
  const lower = ext.toLowerCase()
  if (lower === '.pdf') return 'pdf'
  if (lower === '.ipynb') return 'ipynb'
  if (lower === '.md') return 'md'
  if (lower === '.py') return 'py'
  if (['.png', '.jpg', '.jpeg', '.webp'].includes(lower)) return 'image'
  return 'md'
}

async function countFilesInFolder(
  sb: NonNullable<typeof supabase>,
  folderPath: string
): Promise<number> {
  const { data, error } = await sb.storage.from(BUCKET).list(folderPath, { limit: 1000 })
  if (error) throw new Error(error.message)
  if (!data?.length) return 0
  let count = 0
  for (const item of data) {
    const fullPath = folderPath ? `${folderPath}/${item.name}` : item.name
    if (item.id != null) {
      count += 1
    } else {
      count += await countFilesInFolder(sb, fullPath)
    }
  }
  return count
}

async function collectFilePaths(
  sb: NonNullable<typeof supabase>,
  folderPath: string
): Promise<string[]> {
  const { data, error } = await sb.storage.from(BUCKET).list(folderPath, { limit: 1000 })
  if (error) throw new Error(error.message)
  if (!data?.length) return []
  const paths: string[] = []
  for (const item of data) {
    const fullPath = folderPath ? `${folderPath}/${item.name}` : item.name
    if (item.id != null) {
      paths.push(fullPath)
    } else {
      paths.push(...(await collectFilePaths(sb, fullPath)))
    }
  }
  return paths
}

/** Lista ścieżek wszystkich plików w katalogu projektu w storage. Przy braku Supabase zwraca []. */
export async function listProjectFilePaths(projectId: number): Promise<string[]> {
  const client = supabase
  if (!client) return []
  const prefix = getProjectStorageBasePath(projectId)
  return collectFilePaths(client, prefix)
}

/** Zlicza wszystkie pliki w bucketcie project-files. Przy braku Supabase zwraca 0. */
export async function countAllStorageFiles(): Promise<number> {
  const client = supabase
  if (!client) return 0
  return countFilesInFolder(client, '')
}

/** Przy Supabase no-op – katalog projects/{id}/ powstaje przy pierwszym uploadzie. Dla Express: opcjonalna inicjalizacja katalogu przez serwer. */
export async function initProjectStorage(projectId: number): Promise<void> {
  if (supabase) return
  await apiRequest(`/api/projects/${projectId}/storage/init`, { method: 'POST' })
}

export async function deleteProjectStorage(projectId: number): Promise<void> {
  const client = supabase
  if (client) {
    const prefix = getProjectStorageBasePath(projectId)
    const paths: string[] = []

    async function collectPaths(
      sb: NonNullable<typeof supabase>,
      folderPath: string
    ): Promise<void> {
      const { data, error } = await sb.storage.from(BUCKET).list(folderPath, { limit: 1000 })
      if (error) throw new Error(error.message)
      if (!data?.length) return
      for (const item of data) {
        const fullPath = folderPath ? `${folderPath}/${item.name}` : item.name
        if (item.id != null) {
          paths.push(fullPath)
        } else {
          await collectPaths(sb, fullPath)
        }
      }
    }

    await collectPaths(client, prefix)
    if (paths.length > 0) {
      const { error } = await client.storage.from(BUCKET).remove(paths)
      if (error) throw new Error(error.message)
    }
    return
  }
  await apiRequest(`/api/projects/${projectId}/storage`, { method: 'DELETE' })
}

export interface UploadFileResponse {
  path: string
  label: string
  type?: string
}

export async function uploadProjectFile(
  projectId: number,
  file: File
): Promise<UploadFileResponse> {
  if (supabase) {
    const basePath = getProjectStorageBasePath(projectId)
    const safeName = safeFileName(file.name)
    const path = `${basePath}/${safeName}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true })
    if (error) throw new Error(error.message)
    const ext = file.name.lastIndexOf('.') >= 0 ? file.name.slice(file.name.lastIndexOf('.')) : ''
    const type = extensionToType(ext)
    return { path, label: file.name, type }
  }

  const formData = new FormData()
  formData.append('file', file)
  return apiRequest<UploadFileResponse>(`/api/projects/${projectId}/upload`, {
    method: 'POST',
    body: formData,
  })
}

export async function deleteProjectFile(
  projectId: number,
  path: string
): Promise<void> {
  if (supabase) {
    const normalized = path.replace(/^storage\//, '')
    const expectedPrefix = getProjectStorageBasePath(projectId) + '/'
    if (!normalized.startsWith(expectedPrefix)) {
      throw new Error('Nieprawidłowa ścieżka')
    }
    const { error } = await supabase.storage.from(BUCKET).remove([normalized])
    if (error) throw new Error(error.message)
    return
  }

  await apiRequest(`/api/projects/${projectId}/files?path=${encodeURIComponent(path)}`, {
    method: 'DELETE',
  })
}
