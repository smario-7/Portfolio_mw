import { describe, expect, it, vi } from 'vitest'
import { validateContactForm } from '@/lib/validation/contact-validation'
import { findProfanityInFields } from '@/lib/validation/profanity-filter'

vi.mock('@/lib/validation/profanity-filter', () => ({
  findProfanityInFields: vi.fn(),
}))

describe('validateContactForm', () => {
  beforeEach(() => {
    vi.mocked(findProfanityInFields).mockReturnValue([])
  })
  describe('name', () => {
    it('returns error when name is empty', () => {
      const result = validateContactForm('', 'a@b.pl', 'wiadomość ma 10 zn')
      expect(result.valid).toBe(false)
      expect(result.errors.name).toBe('Imię jest wymagane')
    })

    it('returns error when name is too short', () => {
      const result = validateContactForm('A', 'a@b.pl', 'wiadomość ma 10 zn')
      expect(result.valid).toBe(false)
      expect(result.errors.name).toContain('co najmniej 2 znaki')
    })

    it('returns error when name exceeds max length', () => {
      const longName = 'a'.repeat(51)
      const result = validateContactForm(longName, 'a@b.pl', 'wiadomość ma 10 zn')
      expect(result.valid).toBe(false)
      expect(result.errors.name).toContain('nie może przekraczać 50 znaków')
    })
  })

  describe('email', () => {
    it('returns error when email is empty', () => {
      const result = validateContactForm('Jan', '', 'wiadomość ma 10 zn')
      expect(result.valid).toBe(false)
      expect(result.errors.email).toBe('Email jest wymagany')
    })

    it('returns error when email format is invalid', () => {
      const result = validateContactForm('Jan', 'invalid', 'wiadomość ma 10 zn')
      expect(result.valid).toBe(false)
      expect(result.errors.email).toBe('Podaj poprawny adres email')
    })

    it('returns error when email exceeds max length', () => {
      const longEmail = 'a'.repeat(46) + '@b.pl'
      const result = validateContactForm('Jan', longEmail, 'wiadomość ma 10 zn')
      expect(result.valid).toBe(false)
      expect(result.errors.email).toContain('nie może przekraczać 50 znaków')
    })
  })

  describe('message', () => {
    it('returns error when message is empty', () => {
      const result = validateContactForm('Jan', 'a@b.pl', '')
      expect(result.valid).toBe(false)
      expect(result.errors.message).toBe('Wiadomość jest wymagana')
    })

    it('returns error when message is too short', () => {
      const result = validateContactForm('Jan', 'a@b.pl', 'krótka')
      expect(result.valid).toBe(false)
      expect(result.errors.message).toContain('co najmniej 10 znaków')
    })

    it('returns error when message exceeds max length', () => {
      const longMessage = 'a'.repeat(501)
      const result = validateContactForm('Jan', 'a@b.pl', longMessage)
      expect(result.valid).toBe(false)
      expect(result.errors.message).toContain('nie może przekraczać 500 znaków')
    })
  })

  describe('valid data', () => {
    it('returns valid and empty errors when all fields are correct', () => {
      const result = validateContactForm('Jan Kowalski', 'jan@example.com', 'To jest wiadomość o długości co najmniej dziesięciu znaków.')
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual({})
    })
  })

  describe('profanity', () => {
    it('sets profanity error and per-field message when findProfanityInFields returns results', () => {
      vi.mocked(findProfanityInFields).mockReturnValue([{ field: 'name', words: ['x'] }])
      const result = validateContactForm('Jan', 'a@b.pl', 'ok wiadomość ma 10 zn')
      expect(result.valid).toBe(false)
      expect(result.errors.profanity).toBe('Wykryto niecenzuralne słowa w formularzu. Prosimy o usunięcie ich przed wysłaniem.')
      expect(result.errors.profanityFields).toEqual([{ field: 'name', words: ['x'] }])
      expect(result.errors.name).toContain("Pole 'Imię' zawiera niecenzuralne słowa")
    })
  })
})
