import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ContentData } from '@/lib/types'
import { useContentForm } from '@/hooks/use-content-form'
import * as contentService from '@/lib/services/content-service'
import * as sonner from 'sonner'

vi.mock('@/lib/services/content-service', () => ({
  saveContent: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
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

describe('useContentForm', () => {
  beforeEach(() => {
    vi.mocked(contentService.saveContent).mockReset()
    vi.mocked(sonner.toast.success).mockClear()
    vi.mocked(sonner.toast.error).mockClear()
  })

  describe('handleSave', () => {
    it('calls saveContent with current content, sets saveStatus to saved, lastSaved, and calls onSaved and toast.success', async () => {
      vi.mocked(contentService.saveContent).mockResolvedValue()
      const initialContent = minimalContentData({
        home: { ...minimalContentData().home, heroTitle: 'Test' },
      })
      const onSaved = vi.fn()
      const { result } = renderHook(() =>
        useContentForm({ initialContent, onSaved })
      )

      await act(async () => {
        await result.current.handleSave()
      })

      expect(contentService.saveContent).toHaveBeenCalledTimes(1)
      expect(contentService.saveContent).toHaveBeenCalledWith(
        expect.objectContaining({
          home: expect.objectContaining({ heroTitle: 'Test' }),
        })
      )
      expect(result.current.saveStatus).toBe('saved')
      expect(result.current.lastSaved).not.toBeNull()
      expect(onSaved).toHaveBeenCalledWith(result.current.content)
      expect(sonner.toast.success).toHaveBeenCalledWith('Treść zapisana')
    })

    it('sets saveStatus to idle and calls toast.error when saveContent rejects', async () => {
      vi.mocked(contentService.saveContent).mockRejectedValue(new Error())
      const initialContent = minimalContentData()
      const { result } = renderHook(() =>
        useContentForm({ initialContent })
      )

      await act(async () => {
        await result.current.handleSave()
      })

      expect(result.current.saveStatus).toBe('idle')
      expect(sonner.toast.error).toHaveBeenCalledWith('Wystąpił nieoczekiwany błąd.')
    })
  })
})
