import type { Database, Json } from './database.types'
import type {
  ContentData,
  Project,
  ProjectCategory,
  ProjectDetailBlock,
  ProjectAttachment,
  ProjectDownloadLinks,
} from '@/lib/types'

export type AppDataRow = Database['public']['Tables']['app_data']['Row']
export const APP_DATA_CONTENT_KEY = 'content' as const

export function contentValueToContentData(value: Json): ContentData {
  return value as unknown as ContentData
}

export type ProjectsRow = Database['public']['Tables']['projects']['Row']
export type ProjectsInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectsUpdate = Database['public']['Tables']['projects']['Update']

function jsonToStack(value: unknown): string[] {
  if (Array.isArray(value) && value.every((x) => typeof x === 'string')) {
    return value as string[]
  }
  return []
}

function jsonToBlocks(value: unknown): ProjectDetailBlock[] {
  if (Array.isArray(value)) {
    return value as ProjectDetailBlock[]
  }
  return []
}

function jsonToAttachments(value: unknown): ProjectAttachment[] {
  if (Array.isArray(value)) {
    return value as ProjectAttachment[]
  }
  return []
}

function jsonToDownloadLinks(value: unknown): ProjectDownloadLinks | undefined {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return value as ProjectDownloadLinks
  }
  return undefined
}

export function projectRowToProject(row: ProjectsRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as ProjectCategory,
    stack: jsonToStack(row.stack),
    image: row.image ?? undefined,
    github: row.github,
    demo: row.demo,
    color: row.color ?? undefined,
    order: row.order,
    fullDescription: jsonToBlocks(row.full_description),
    attachments: jsonToAttachments(row.attachments),
    downloadLinks: jsonToDownloadLinks(row.download_links),
    status: row.status === 'draft' || row.status === 'published' ? row.status : undefined,
    featured: row.featured ?? undefined,
    created_at: row.created_at ?? undefined,
    updated_at: row.updated_at ?? undefined,
  }
}

const DEFAULT_CATEGORY: ProjectCategory = 'Frontend'

export function projectToProjectsInsert(
  project: Partial<Project> & { category: ProjectCategory }
): ProjectsInsert {
  return {
    title: project.title ?? '',
    description: project.description ?? '',
    category: project.category ?? DEFAULT_CATEGORY,
    stack: project.stack ?? [],
    image: project.image ?? null,
    github: project.github ?? '',
    demo: project.demo ?? '',
    color: project.color ?? null,
    order: project.order ?? 0,
    full_description: (project.fullDescription ?? []) as unknown as Json,
    attachments: (project.attachments ?? []) as unknown as Json,
    download_links: (project.downloadLinks ?? null) as unknown as Json | null,
    status: project.status ?? 'draft',
    featured: project.featured ?? false,
  }
}

export function projectToProjectsUpdate(project: Partial<Project>): ProjectsUpdate {
  const u: ProjectsUpdate = {}
  if (project.title !== undefined) u.title = project.title
  if (project.description !== undefined) u.description = project.description
  if (project.category !== undefined) u.category = project.category
  if (project.stack !== undefined) u.stack = project.stack
  if (project.image !== undefined) u.image = project.image ?? null
  if (project.github !== undefined) u.github = project.github
  if (project.demo !== undefined) u.demo = project.demo
  if (project.color !== undefined) u.color = project.color ?? null
  if (project.order !== undefined) u.order = project.order
  if (project.fullDescription !== undefined) u.full_description = project.fullDescription as unknown as Json
  if (project.attachments !== undefined) u.attachments = project.attachments as unknown as Json
  if (project.downloadLinks !== undefined) u.download_links = (project.downloadLinks ?? null) as unknown as Json | null
  if (project.status !== undefined) u.status = project.status
  if (project.featured !== undefined) u.featured = project.featured
  return u
}
