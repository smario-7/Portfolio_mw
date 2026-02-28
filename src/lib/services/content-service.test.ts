import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ContentData } from '@/lib/types'
import {
  hasAboutContent,
  hasContactContent,
  loadContent,
  saveContent,
} from '@/lib/services/content-service'
import * as contentApi from '@/lib/api/content-api'

vi.mock('@/lib/api/content-api', () => ({
  getContent: vi.fn(),
  saveContent: vi.fn(),
}))

function minimalContentData(overrides: Partial<ContentData> = {}): ContentData {
  return {
    home: {
      heroTitle: '',
      heroSubtitle: '',
      heroDescription: '',
      button1Text: '',
      button2Text: '',
      projectsTitle: '',
      projectsDescription: '',
      skills: [],
    },
    about: {
      introduction: '',
      courses: [],
      skills: {},
    },
    contact: {
      title: '',
      description: '',
      email: '',
      phone: '',
      github: '',
      linkedin: '',
    },
    ...overrides,
  }
}

describe('content-service', () => {
  describe('hasAboutContent', () => {
    it('returns false when about is missing', () => {
      const content = minimalContentData()
      // @ts-expect-error testing runtime shape
      content.about = undefined
      expect(hasAboutContent(content)).toBe(false)
    })

    it('returns false when about is empty (no introduction, courses, skills, tools)', () => {
      const content = minimalContentData()
      expect(hasAboutContent(content)).toBe(false)
    })

    it('returns true when introduction is non-empty after trim', () => {
      const content = minimalContentData({
        about: { introduction: '  x  ', courses: [], skills: {} },
      })
      expect(hasAboutContent(content)).toBe(true)
    })

    it('returns true when courses array is non-empty', () => {
      const content = minimalContentData({
        about: {
          introduction: '',
          courses: [
            {
              courseName: 'A',
              description: 'd',
              completionDate: { year: 2020, month: 1 },
            },
          ],
          skills: {},
        },
      })
      expect(hasAboutContent(content)).toBe(true)
    })

    it('returns true when skills has at least one non-empty array', () => {
      const content = minimalContentData({
        about: {
          introduction: '',
          courses: [],
          skills: { frontend: ['React'] },
        },
      })
      expect(hasAboutContent(content)).toBe(true)
    })

    it('returns true when tools array is non-empty', () => {
      const content = minimalContentData({
        about: {
          introduction: '',
          courses: [],
          skills: {},
          tools: ['vite'],
        },
      })
      expect(hasAboutContent(content)).toBe(true)
    })
  })

  describe('hasContactContent', () => {
    it('returns false when contact is missing', () => {
      const content = minimalContentData()
      // @ts-expect-error testing runtime shape
      content.contact = undefined
      expect(hasContactContent(content)).toBe(false)
    })

    it('returns false when contact has no links, email or phone', () => {
      const content = minimalContentData()
      expect(hasContactContent(content)).toBe(false)
    })

    it('returns true when links array is non-empty', () => {
      const content = minimalContentData({
        contact: {
          title: '',
          description: '',
          email: '',
          phone: '',
          github: '',
          linkedin: '',
          links: [{ type: 'email', value: 'a@b.pl' }],
        },
      })
      expect(hasContactContent(content)).toBe(true)
    })

    it('returns true when email is non-empty after trim', () => {
      const content = minimalContentData({
        contact: {
          title: '',
          description: '',
          email: '  a@b.pl  ',
          phone: '',
          github: '',
          linkedin: '',
        },
      })
      expect(hasContactContent(content)).toBe(true)
    })

    it('returns true when phone is non-empty', () => {
      const content = minimalContentData({
        contact: {
          title: '',
          description: '',
          email: '',
          phone: '123',
          github: '',
          linkedin: '',
        },
      })
      expect(hasContactContent(content)).toBe(true)
    })
  })

  describe('loadContent', () => {
    beforeEach(() => {
      vi.mocked(contentApi.getContent).mockReset()
    })

    it('returns data from getContent and calls API once', async () => {
      const data = minimalContentData({
        home: { ...minimalContentData().home, heroTitle: 'Test' },
      })
      vi.mocked(contentApi.getContent).mockResolvedValue(data)

      const result = await loadContent()

      expect(result).toBe(data)
      expect(contentApi.getContent).toHaveBeenCalledTimes(1)
    })
  })

  describe('saveContent', () => {
    beforeEach(() => {
      vi.mocked(contentApi.saveContent).mockReset()
    })

    it('calls saveContent API with the same data', async () => {
      const data = minimalContentData()
      vi.mocked(contentApi.saveContent).mockResolvedValue(undefined)

      await saveContent(data)

      expect(contentApi.saveContent).toHaveBeenCalledTimes(1)
      expect(contentApi.saveContent).toHaveBeenCalledWith(data)
    })
  })
})
