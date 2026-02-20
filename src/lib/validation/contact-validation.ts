import { CONTACT_FORM_LIMITS } from '@/lib/constants/contact-form-limits'
import { findProfanityInFields, type ProfanityFieldResult } from './profanity-filter'

export interface ContactFormErrors {
  name?: string
  email?: string
  message?: string
  profanity?: string
  profanityFields?: ProfanityFieldResult[]
}

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export function validateContactForm(
  name: string,
  email: string,
  message: string
): { valid: boolean; errors: ContactFormErrors } {
  const errors: ContactFormErrors = {}

  const trimmedName = name.trim()
  if (!trimmedName) {
    errors.name = 'Imię jest wymagane'
  } else if (trimmedName.length < CONTACT_FORM_LIMITS.NAME_MIN) {
    errors.name = `Imię musi mieć co najmniej ${CONTACT_FORM_LIMITS.NAME_MIN} znaki`
  } else if (trimmedName.length > CONTACT_FORM_LIMITS.NAME_MAX) {
    errors.name = `Imię nie może przekraczać ${CONTACT_FORM_LIMITS.NAME_MAX} znaków`
  }

  const trimmedEmail = email.trim()
  if (!trimmedEmail) {
    errors.email = 'Email jest wymagany'
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Podaj poprawny adres email'
  } else if (trimmedEmail.length > CONTACT_FORM_LIMITS.EMAIL_MAX) {
    errors.email = `Email nie może przekraczać ${CONTACT_FORM_LIMITS.EMAIL_MAX} znaków`
  }

  const trimmedMessage = message.trim()
  if (!trimmedMessage) {
    errors.message = 'Wiadomość jest wymagana'
  } else if (trimmedMessage.length < CONTACT_FORM_LIMITS.MESSAGE_MIN) {
    errors.message = `Wiadomość musi mieć co najmniej ${CONTACT_FORM_LIMITS.MESSAGE_MIN} znaków`
  } else if (trimmedMessage.length > CONTACT_FORM_LIMITS.MESSAGE_MAX) {
    errors.message = `Wiadomość nie może przekraczać ${CONTACT_FORM_LIMITS.MESSAGE_MAX} znaków`
  }

  const profanityResults = findProfanityInFields({
    name: trimmedName,
    email: trimmedEmail,
    message: trimmedMessage,
  })

  if (import.meta.env.DEV) {
    console.log('Walidacja profanity - wyniki:', profanityResults, 'dla pól:', { name: trimmedName, email: trimmedEmail, message: trimmedMessage })
  }

  if (profanityResults.length > 0) {
    errors.profanity = 'Wykryto niecenzuralne słowa w formularzu. Prosimy o usunięcie ich przed wysłaniem.'
    errors.profanityFields = profanityResults

    const fieldNames: Record<string, string> = {
      name: 'Imię',
      email: 'Email',
      message: 'Wiadomość',
    }

    for (const result of profanityResults) {
      const fieldName = fieldNames[result.field] || result.field
      if (result.field === 'name' && !errors.name) {
        errors.name = `Pole '${fieldName}' zawiera niecenzuralne słowa`
      } else if (result.field === 'email' && !errors.email) {
        errors.email = `Pole '${fieldName}' zawiera niecenzuralne słowa`
      } else if (result.field === 'message' && !errors.message) {
        errors.message = `Pole '${fieldName}' zawiera niecenzuralne słowa`
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
