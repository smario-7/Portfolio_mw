import type { Project, ProjectDetailBlock, BlockText } from '@/lib/types'

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
