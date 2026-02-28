import { describe, expect, it } from 'vitest'
import {
  validateContentSection,
  validateContentData,
} from '@/lib/validation/content-validation'
import type { ContentData } from '@/lib/types'

describe("validateContentSection('home', data)", () => {
  it('returns error when heroTitle is missing', () => {
    const result = validateContentSection('home', {
      home: { heroSubtitle: 'Podtytuł' },
    } as Partial<ContentData>)
    expect(result.home?.heroTitle).toBe('Tytuł jest wymagany')
  })

  it('returns error when heroSubtitle is missing', () => {
    const result = validateContentSection('home', {
      home: { heroTitle: 'Tytuł' },
    } as Partial<ContentData>)
    expect(result.home?.heroSubtitle).toBe('Podtytuł jest wymagany')
  })

  it('returns both errors when home fields are empty', () => {
    const result = validateContentSection('home', { home: {} } as Partial<ContentData>)
    expect(result.home?.heroTitle).toBe('Tytuł jest wymagany')
    expect(result.home?.heroSubtitle).toBe('Podtytuł jest wymagany')
  })

  it('returns no home errors when both heroTitle and heroSubtitle are set', () => {
    const result = validateContentSection('home', {
      home: { heroTitle: 'Tytuł', heroSubtitle: 'Podtytuł' },
    } as Partial<ContentData>)
    expect(result.home).toBeUndefined()
  })

  it('returns no errors when data.home is missing', () => {
    const result = validateContentSection('home', {})
    expect(result.home).toBeUndefined()
  })
})

describe("validateContentSection('about', data)", () => {
  it('returns error when introduction is missing', () => {
    const result = validateContentSection('about', {
      about: {},
    } as Partial<ContentData>)
    expect(result.about?.introduction).toBe('Wprowadzenie jest wymagane')
  })

  it('returns error when introduction is empty string', () => {
    const result = validateContentSection('about', {
      about: { introduction: '' },
    } as Partial<ContentData>)
    expect(result.about?.introduction).toBe('Wprowadzenie jest wymagane')
  })

  it('returns no about errors when introduction is set', () => {
    const result = validateContentSection('about', {
      about: { introduction: 'Tekst wprowadzenia' },
    } as Partial<ContentData>)
    expect(result.about).toBeUndefined()
  })

  it('returns no errors when data.about is missing', () => {
    const result = validateContentSection('about', {})
    expect(result.about).toBeUndefined()
  })
})

describe("validateContentSection('contact', data)", () => {
  it('returns error when no contact method is provided', () => {
    const result = validateContentSection('contact', {
      contact: {},
    } as Partial<ContentData>)
    expect(result.contact?.email).toBe(
      'Przynajmniej jeden kontakt jest wymagany (email, telefon lub linki)',
    )
  })

  it('returns no error when email is valid', () => {
    const result = validateContentSection('contact', {
      contact: { email: 'user@example.com' },
    } as Partial<ContentData>)
    expect(result.contact).toBeUndefined()
  })

  it('returns no error when phone is set', () => {
    const result = validateContentSection('contact', {
      contact: { phone: '+48 123 456 789' },
    } as Partial<ContentData>)
    expect(result.contact).toBeUndefined()
  })

  it('returns no error when links array has items', () => {
    const result = validateContentSection('contact', {
      contact: {
        links: [{ type: 'email', value: 'a@b.pl', label: 'Email' }],
      },
    } as Partial<ContentData>)
    expect(result.contact).toBeUndefined()
  })

  it('returns error when email is provided but invalid', () => {
    const result = validateContentSection('contact', {
      contact: { email: 'invalid' },
    } as Partial<ContentData>)
    expect(result.contact?.email).toBe('Email musi być poprawny')
  })
})

describe('validateContentData', () => {
  it('aggregates errors from home, about and contact', () => {
    const content = {
      home: {},
      about: {},
      contact: {},
    } as Partial<ContentData>
    const result = validateContentData(content)
    expect(result.home?.heroTitle).toBe('Tytuł jest wymagany')
    expect(result.home?.heroSubtitle).toBe('Podtytuł jest wymagany')
    expect(result.about?.introduction).toBe('Wprowadzenie jest wymagane')
    expect(result.contact?.email).toBe(
      'Przynajmniej jeden kontakt jest wymagany (email, telefon lub linki)',
    )
  })

  it('returns empty errors when all sections are valid', () => {
    const content = {
      home: { heroTitle: 'Tytuł', heroSubtitle: 'Podtytuł' },
      about: { introduction: 'Wprowadzenie' },
      contact: { email: 'a@b.pl' },
    } as Partial<ContentData>
    const result = validateContentData(content)
    expect(result.home).toBeUndefined()
    expect(result.about).toBeUndefined()
    expect(result.contact).toBeUndefined()
  })
})
