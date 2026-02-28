import { describe, expect, it, vi } from 'vitest'
import {
  normalizeText,
  checkProfanity,
  findProfanityInFields,
} from '@/lib/validation/profanity-filter'

vi.mock('@/lib/data/profanity-list.json', () => ({
  default: { words: ['testword', 'badword'] },
}))

describe('normalizeText', () => {
  it('replaces Polish characters with ASCII equivalents', () => {
    expect(normalizeText('łąka')).toBe('laka')
    expect(normalizeText('ćma')).toBe('cma')
    expect(normalizeText('łóżko')).toBe('lozko')
  })

  it('converts to lowercase', () => {
    expect(normalizeText('Ćma')).toBe('cma')
  })

  it('normalizes all Polish diacritics in one string', () => {
    expect(normalizeText('ąćęłńóśźż')).toBe('acelnoszz')
  })

  it('strips NFD combining marks (e.g. é → e)', () => {
    expect(normalizeText('café')).toBe('cafe')
  })
})

describe('checkProfanity', () => {
  it('returns no profanity for empty string', () => {
    expect(checkProfanity('')).toEqual({ hasProfanity: false, words: [] })
  })

  it('returns no profanity for whitespace-only string', () => {
    expect(checkProfanity('   ')).toEqual({ hasProfanity: false, words: [] })
  })

  it('returns no profanity when text has no word from list', () => {
    expect(checkProfanity('hello world')).toEqual({
      hasProfanity: false,
      words: [],
    })
  })

  it('returns hasProfanity and detected word when text contains word from list', () => {
    expect(checkProfanity('hello testword')).toEqual({
      hasProfanity: true,
      words: ['testword'],
    })
  })

  it('returns both words when text contains two words from list', () => {
    const result = checkProfanity('badword and testword')
    expect(result.hasProfanity).toBe(true)
    expect(result.words).toContain('testword')
    expect(result.words).toContain('badword')
    expect(result.words).toHaveLength(2)
  })
})

describe('findProfanityInFields', () => {
  it('returns empty array when all fields are empty or missing', () => {
    expect(findProfanityInFields({})).toEqual([])
    expect(findProfanityInFields({ name: '', email: '', message: '' })).toEqual(
      [],
    )
  })

  it('returns result only for name when only name has profanity', () => {
    expect(findProfanityInFields({ name: 'testword' })).toEqual([
      { field: 'name', words: ['testword'] },
    ])
  })

  it('returns result only for message when only message has profanity', () => {
    expect(findProfanityInFields({ message: 'badword' })).toEqual([
      { field: 'message', words: ['badword'] },
    ])
  })

  it('returns results for each field that has profanity', () => {
    const result = findProfanityInFields({
      name: 'testword',
      email: 'ok',
      message: 'badword',
    })
    expect(result).toHaveLength(2)
    expect(result).toContainEqual({ field: 'name', words: ['testword'] })
    expect(result).toContainEqual({ field: 'message', words: ['badword'] })
  })

  it('does not check empty fields (truthy check)', () => {
    const result = findProfanityInFields({ name: '', message: 'badword' })
    expect(result).toEqual([{ field: 'message', words: ['badword'] }])
  })
})
