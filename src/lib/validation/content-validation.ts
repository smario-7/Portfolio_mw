import type { ContentData } from '@/lib/types'
import type { Section } from '@/lib/constants/sections'

export interface ContentFormErrors {
  home?: {
    heroTitle?: string
    heroSubtitle?: string
  }
  about?: {
    introduction?: string
  }
  contact?: {
    email?: string
    phone?: string
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateContentSection(
  section: Section,
  data: Partial<ContentData>
): ContentFormErrors {
  const errors: ContentFormErrors = {}

  if (section === 'home') {
    const home = data.home
    if (home) {
      if (!home.heroTitle?.trim()) {
        errors.home = { ...errors.home, heroTitle: 'Tytuł jest wymagany' }
      }
      if (!home.heroSubtitle?.trim()) {
        errors.home = { ...errors.home, heroSubtitle: 'Podtytuł jest wymagany' }
      }
    }
  }

  if (section === 'about') {
    const about = data.about
    if (about && !about.introduction?.trim()) {
      errors.about = { introduction: 'Wprowadzenie jest wymagane' }
    }
  }

  if (section === 'contact') {
    const contact = data.contact
    if (contact) {
      const hasEmail = contact.email?.trim()
      const hasPhone = contact.phone?.trim()
      const hasLinks = contact.links && contact.links.length > 0

      if (!hasEmail && !hasPhone && !hasLinks) {
        errors.contact = {
          email: 'Przynajmniej jeden kontakt jest wymagany (email, telefon lub linki)',
        }
      }

      if (hasEmail && !isValidEmail(contact.email.trim())) {
        errors.contact = { ...errors.contact, email: 'Email musi być poprawny' }
      }
    }
  }

  return errors
}

export function validateContentData(content: Partial<ContentData>): ContentFormErrors {
  const errors: ContentFormErrors = {}

  if (content.home) {
    const homeErrors = validateContentSection('home', content)
    if (homeErrors.home) {
      errors.home = homeErrors.home
    }
  }

  if (content.about) {
    const aboutErrors = validateContentSection('about', content)
    if (aboutErrors.about) {
      errors.about = aboutErrors.about
    }
  }

  if (content.contact) {
    const contactErrors = validateContentSection('contact', content)
    if (contactErrors.contact) {
      errors.contact = contactErrors.contact
    }
  }

  return errors
}
