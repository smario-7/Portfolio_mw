import type { ProjectCategory } from '@/lib/types'

export interface ProjectFormErrors {
  title?: string
  shortDescription?: string
  description?: string
  technologies?: string
  githubUrl?: string
  demoUrl?: string
  image?: string
}

export interface ProjectFormData {
  title: string
  shortDescription: string
  description: string
  technologies: string[]
  githubUrl: string
  demoUrl: string
  category: ProjectCategory
  featured: boolean
  status: 'draft' | 'published'
  image: File | null
  pdf: File | null
  ipynb: File | null
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function validateProjectForm(formData: Partial<ProjectFormData>): ProjectFormErrors {
  const errors: ProjectFormErrors = {}

  if (!formData.title?.trim()) {
    errors.title = 'Tytuł jest wymagany'
  }

  if (!formData.shortDescription?.trim()) {
    errors.shortDescription = 'Krótki opis jest wymagany'
  }

  if (!formData.description?.trim()) {
    errors.description = 'Pełny opis jest wymagany'
  }

  if (!formData.technologies || formData.technologies.length === 0) {
    errors.technologies = 'Dodaj co najmniej jedną technologię'
  }

  if (!formData.githubUrl?.trim()) {
    errors.githubUrl = 'Link GitHub jest wymagany'
  } else if (!isValidUrl(formData.githubUrl.trim())) {
    errors.githubUrl = 'Link GitHub musi być poprawnym URL'
  }

  if (!formData.demoUrl?.trim()) {
    errors.demoUrl = 'Link Demo jest wymagany'
  } else if (!isValidUrl(formData.demoUrl.trim())) {
    errors.demoUrl = 'Link Demo musi być poprawnym URL'
  }

  return errors
}

export function validateProjectFormPartial(formData: Partial<ProjectFormData>): ProjectFormErrors {
  const errors: ProjectFormErrors = {}

  if (formData.title !== undefined && !formData.title.trim()) {
    errors.title = 'Tytuł jest wymagany'
  }

  if (formData.shortDescription !== undefined && !formData.shortDescription.trim()) {
    errors.shortDescription = 'Krótki opis jest wymagany'
  }

  if (formData.technologies !== undefined && formData.technologies.length === 0) {
    errors.technologies = 'Dodaj co najmniej jedną technologię'
  }

  if (formData.githubUrl !== undefined) {
    if (!formData.githubUrl.trim()) {
      errors.githubUrl = 'Link GitHub jest wymagany'
    } else if (!isValidUrl(formData.githubUrl.trim())) {
      errors.githubUrl = 'Link GitHub musi być poprawnym URL'
    }
  }

  if (formData.demoUrl !== undefined) {
    if (!formData.demoUrl.trim()) {
      errors.demoUrl = 'Link Demo jest wymagany'
    } else if (!isValidUrl(formData.demoUrl.trim())) {
      errors.demoUrl = 'Link Demo musi być poprawnym URL'
    }
  }

  return errors
}
