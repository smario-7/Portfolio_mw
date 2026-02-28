import type {
  Project,
  ProjectAttachment,
  ProjectDetailBlock,
  BlockText,
} from '@/lib/types'
import type { ProjectFormData } from '@/lib/validation/project-validation'

export interface RawProject extends Omit<Project, 'fullDescription'> {
  fullDescription?: string | ProjectDetailBlock[]
}

function isBlockArray(
  value: string | ProjectDetailBlock[] | undefined
): value is ProjectDetailBlock[] {
  return Array.isArray(value)
}

export function fullDescriptionToBlocks(
  value: string | ProjectDetailBlock[] | undefined
): ProjectDetailBlock[] {
  if (value === undefined) return []
  if (isBlockArray(value)) return value
  if (typeof value === 'string') {
    const s = value.trim()
    return s ? [{ type: 'text', content: value }] : []
  }
  return []
}

export function normalizeProject(raw: RawProject): Project {
  const fullDescription = fullDescriptionToBlocks(raw.fullDescription)
  return {
    ...raw,
    fullDescription: fullDescription.length > 0 ? fullDescription : undefined,
  }
}

export function fullDescriptionBlocksToFormString(
  blocks: ProjectDetailBlock[] | undefined
): string {
  if (!blocks || blocks.length === 0) return ''
  const textContents = blocks
    .filter((b): b is BlockText => b.type === 'text')
    .map((b) => b.content)
  return textContents.join('\n\n')
}

export function formStringToFullDescriptionBlocks(
  s: string
): ProjectDetailBlock[] | undefined {
  const trimmed = s.trim()
  if (!trimmed) return undefined
  return [{ type: 'text', content: trimmed }]
}

export interface BuildProjectFromFormDataParams {
  formData: ProjectFormData
  attachments: ProjectAttachment[]
  projectId: number
  existingImagePath?: string
}

export function buildProjectFromFormData(
  params: BuildProjectFromFormDataParams
): Project {
  const { formData, attachments, projectId, existingImagePath } = params
  const image =
    formData.imagePath?.trim() || existingImagePath || undefined
  const fullDescription =
    formData.fullDescriptionBlocks.length > 0
      ? formData.fullDescriptionBlocks
      : undefined
  return {
    id: projectId,
    title: formData.title.trim(),
    description: formData.shortDescription.trim(),
    category: formData.category,
    stack: formData.technologies,
    github: formData.githubUrl.trim(),
    demo: formData.demoUrl.trim(),
    image,
    color: formData.color?.trim() || undefined,
    status: formData.status,
    featured: formData.featured,
    fullDescription,
    attachments,
  }
}
