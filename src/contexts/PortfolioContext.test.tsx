import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { PortfolioProvider, useContent } from '@/contexts/PortfolioContext'
import type { ContentData } from '@/lib/types'
import type { Project } from '@/lib/types'
import { CONTENT_SAVE_DEBOUNCE_MS } from '@/lib/constants/context-save'
import * as contentService from '@/lib/services/content-service'
import * as _projectsService from '@/lib/services/projects-service'

vi.mock('@/lib/supabase/client', () => ({ supabase: null }))

vi.mock('@/lib/supabase/auth', () => ({
  getSession: vi.fn().mockResolvedValue({
    data: { session: { access_token: 'test' } },
  }),
  isSessionValid: vi.fn().mockReturnValue(true),
}))

vi.mock('@/lib/services/content-service', () => ({
  saveContent: vi.fn(),
  loadContent: vi.fn(),
}))

vi.mock('@/lib/services/projects-service', () => ({
  loadProjects: vi.fn(),
  saveProjects: vi.fn(),
  getProjectFilters: vi.fn(() => []),
  createProject: vi.fn(),
  updateProject: vi.fn().mockResolvedValue({
    id: 1,
    title: 'Test',
    description: '',
    category: 'Frontend',
    stack: [],
    github: '',
    demo: '',
    order: 1,
  } as Project),
  deleteProject: vi.fn(),
  nextProjectId: vi.fn(() => 1),
}))

vi.mock('@/lib/api/storage-api', () => ({
  deleteProjectStorage: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

function wrapper({ children }: { children: ReactNode }) {
  return <PortfolioProvider>{children}</PortfolioProvider>
}

describe('PortfolioContext', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(contentService.saveContent).mockReset().mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('zapis content po setContent (debounce)', () => {
    it('wywołuje saveContent po upływie CONTENT_SAVE_DEBOUNCE_MS od setContent', async () => {
      const { result } = renderHook(() => useContent(), { wrapper })

      await act(async () => {
        vi.advanceTimersByTime(0)
      })

      const newContent: ContentData = {
        ...result.current.content,
        home: {
          ...result.current.content.home,
          heroTitle: 'Nowy tytuł',
        },
      }

      act(() => {
        result.current.setContent(newContent)
      })

      expect(contentService.saveContent).not.toHaveBeenCalled()

      await act(async () => {
        vi.advanceTimersByTime(CONTENT_SAVE_DEBOUNCE_MS)
      })

      expect(contentService.saveContent).toHaveBeenCalledTimes(1)
      expect(contentService.saveContent).toHaveBeenCalledWith(
        expect.objectContaining({
          home: expect.objectContaining({ heroTitle: 'Nowy tytuł' }),
        })
      )
    })

    it('nie wywołuje saveContent przed upływem debounce', async () => {
      const { result } = renderHook(() => useContent(), { wrapper })

      await act(async () => {
        vi.advanceTimersByTime(0)
      })

      const newContent: ContentData = {
        ...result.current.content,
        home: { ...result.current.content.home, heroTitle: 'Test' },
      }

      act(() => {
        result.current.setContent(newContent)
      })

      await act(async () => {
        vi.advanceTimersByTime(CONTENT_SAVE_DEBOUNCE_MS - 1)
      })

      expect(contentService.saveContent).not.toHaveBeenCalled()
    })
  })

  describe('replaceContent', () => {
    it('nie triggeruje zapisu po upływie debounce (ref ustawiony, brak drugiego wywołania saveContent)', async () => {
      const { result } = renderHook(() => useContent(), { wrapper })

      await act(async () => {
        vi.advanceTimersByTime(0)
      })

      const contentToReplace: ContentData = {
        ...result.current.content,
        home: { ...result.current.content.home, heroTitle: 'Zastąpiona treść' },
      }

      act(() => {
        result.current.replaceContent(contentToReplace)
      })

      await act(async () => {
        vi.advanceTimersByTime(CONTENT_SAVE_DEBOUNCE_MS)
      })

      expect(contentService.saveContent).not.toHaveBeenCalled()
    })
  })
})
