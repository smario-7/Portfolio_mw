import type { ProjectCategory, ProjectDetailBlock, ProjectDownloadLinks } from '@/lib/types'

export interface ProjectFormErrors {
  title?: string
  shortDescription?: string
  technologies?: string
  githubUrl?: string
  demoUrl?: string
  image?: string
  fullDescriptionBlocks?: Record<number, string>
}

export function validateFullDescriptionBlocks(
  blocks: ProjectDetailBlock[]
): Record<number, string> {
  const errors: Record<number, string> = {}
  blocks.forEach((block, index) => {
    if (block.type === 'screenshot') {
      if (!block.path?.trim()) {
        errors[index] = 'Screenshot: podaj ścieżkę do obrazka'
      }
    } else if (block.type === 'code') {
      if (!block.sourceFile?.trim()) {
        errors[index] = 'Kod: wybierz plik źródłowy'
      } else {
        const trimmed = block.fragmentId?.trim() ?? ''
        if (block.sourceType === 'py') {
          if (trimmed && trimmed.toLowerCase() !== 'all') {
            const single = /^\d+$/.test(trimmed)
            const rangeMatch = /^(\d+)-(\d+)$/.exec(trimmed)
            if (single) {
              // ok
            } else if (rangeMatch) {
              const n = parseInt(rangeMatch[1], 10)
              const m = parseInt(rangeMatch[2], 10)
              if (n > m) {
                errors[index] = 'Kod (.py): zakres linii – wartość „od” musi być mniejsza lub równa „do”'
              }
            } else {
              errors[index] = 'Kod (.py): fragment to numer linii (np. 7) lub zakres (np. 10-25)'
            }
          }
        } else {
          if (trimmed) {
            const parts = trimmed.split(',')
            const valid = parts.every((p) => {
              const t = p.trim()
              if (/^\d+$/.test(t)) return true
              if (/^\d+-\d+$/.test(t)) return true
              return false
            })
            if (!valid) {
              errors[index] = 'Kod (ipynb): fragment to indeksy komórek (np. 0,2,4 lub 1-3)'
            }
          }
        }
      }
    }
  })
  return errors
}

export interface ProjectFormData {
  title: string
  shortDescription: string
  fullDescriptionBlocks: ProjectDetailBlock[]
  technologies: string[]
  githubUrl: string
  demoUrl: string
  category: ProjectCategory
  featured: boolean
  status: 'draft' | 'published'
  image: File | null
  imagePath: string
  pdf: File | null
  ipynb: File | null
  downloadLinks: ProjectDownloadLinks
  color?: string
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function validateProjectFormFields(
  formData: Partial<ProjectFormData>,
  partial: boolean
): ProjectFormErrors {
  const errors: ProjectFormErrors = {}

  const check = (key: keyof ProjectFormErrors, condition: boolean, message: string) => {
    if (condition) errors[key] = message
  }

  if (!partial || formData.title !== undefined) {
    check('title', !formData.title?.trim(), 'Tytuł jest wymagany')
  }
  if (!partial || formData.shortDescription !== undefined) {
    check('shortDescription', !formData.shortDescription?.trim(), 'Krótki opis jest wymagany')
  }
  if (!partial || formData.technologies !== undefined) {
    check(
      'technologies',
      !formData.technologies || formData.technologies.length === 0,
      'Dodaj co najmniej jedną technologię'
    )
  }
  if (!partial || formData.githubUrl !== undefined) {
    const github = formData.githubUrl?.trim()
    if (github && !isValidUrl(github)) {
      check('githubUrl', true, 'Link GitHub musi być poprawnym URL')
    }
  }
  if (!partial || formData.demoUrl !== undefined) {
    const demo = formData.demoUrl?.trim()
    if (demo && !isValidUrl(demo)) {
      check('demoUrl', true, 'Link Demo musi być poprawnym URL')
    }
  }
  if (formData.fullDescriptionBlocks?.length) {
    const blockErrors = validateFullDescriptionBlocks(formData.fullDescriptionBlocks)
    if (Object.keys(blockErrors).length > 0) {
      errors.fullDescriptionBlocks = blockErrors
    }
  }

  return errors
}

export function validateProjectForm(formData: Partial<ProjectFormData>): ProjectFormErrors {
  return validateProjectFormFields(formData, false)
}

export function validateProjectFormPartial(formData: Partial<ProjectFormData>): ProjectFormErrors {
  return validateProjectFormFields(formData, true)
}
