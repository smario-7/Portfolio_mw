import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Project } from '@/lib/types'
import {
  getProjectFilters,
  nextProjectId,
  getToolsCatalog,
  loadProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '@/lib/services/projects-service'
import * as projectsApi from '@/lib/api/projects-api'
import { TOOLS_CATALOG } from '@/lib/data/tools-catalog'

vi.mock('@/lib/api/projects-api', () => ({
  getProjects: vi.fn(),
  getProjectById: vi.fn(),
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
  saveProjects: vi.fn(),
}))

function minimalProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 1,
    title: '',
    description: '',
    category: 'Frontend',
    stack: [],
    github: '',
    demo: '',
    ...overrides,
  }
}

describe('projects-service', () => {
  describe('getProjectFilters', () => {
    it('returns empty array for empty list', () => {
      expect(getProjectFilters([])).toEqual([])
    })

    it('returns Wszystkie and category for single project', () => {
      expect(getProjectFilters([minimalProject({ category: 'Frontend' })])).toEqual([
        'Wszystkie',
        'Frontend',
      ])
    })

    it('returns unique sorted categories with Wszystkie first', () => {
      const list = [
        minimalProject({ id: 1, category: 'Backend' }),
        minimalProject({ id: 2, category: 'Frontend' }),
        minimalProject({ id: 3, category: 'Backend' }),
      ]
      expect(getProjectFilters(list)).toEqual(['Wszystkie', 'Backend', 'Frontend'])
    })
  })

  describe('nextProjectId', () => {
    it('returns 1 for empty list', () => {
      expect(nextProjectId([])).toBe(1)
    })

    it('returns max id + 1 for non-empty list', () => {
      const list = [
        minimalProject({ id: 3 }),
        minimalProject({ id: 1 }),
        minimalProject({ id: 2 }),
      ]
      expect(nextProjectId(list)).toBe(4)
    })

    it('returns 1 when all ids are 0', () => {
      expect(nextProjectId([minimalProject({ id: 0 })])).toBe(1)
    })
  })

  describe('getToolsCatalog', () => {
    it('returns the same reference as TOOLS_CATALOG', () => {
      expect(getToolsCatalog()).toBe(TOOLS_CATALOG)
    })

    it('returns array with items having id, name, icon', () => {
      const catalog = getToolsCatalog()
      expect(catalog.length).toBeGreaterThan(0)
      expect(catalog[0]).toHaveProperty('id')
      expect(catalog[0]).toHaveProperty('name')
      expect(catalog[0]).toHaveProperty('icon')
    })
  })

  describe('loadProjects', () => {
    beforeEach(() => {
      vi.mocked(projectsApi.getProjects).mockReset()
    })

    it('returns normalized projects when API returns raw fullDescription as string', async () => {
      const rawList = [
        {
          id: 1,
          title: 'T',
          description: 'D',
          category: 'Frontend' as const,
          stack: [],
          github: '',
          demo: '',
          fullDescription: 'opis tekstowy',
        },
      ]
      vi.mocked(projectsApi.getProjects).mockResolvedValue(rawList as unknown as Project[])

      const result = await loadProjects()

      expect(projectsApi.getProjects).toHaveBeenCalledTimes(1)
      expect(result).toHaveLength(1)
      expect(result[0].fullDescription).toEqual([
        { type: 'text', content: 'opis tekstowy' },
      ])
    })

    it('returns normalized projects when API returns fullDescription as blocks', async () => {
      const rawList = [
        {
          id: 2,
          title: 'P',
          description: '',
          category: 'Backend' as const,
          stack: [],
          github: '',
          demo: '',
          fullDescription: [{ type: 'text' as const, content: 'x' }],
        },
      ]
      vi.mocked(projectsApi.getProjects).mockResolvedValue(rawList as unknown as Project[])

      const result = await loadProjects()

      expect(result[0].fullDescription).toEqual([{ type: 'text', content: 'x' }])
    })

    it('returns empty array when API returns non-array', async () => {
      vi.mocked(projectsApi.getProjects).mockResolvedValue(null as unknown as Project[])

      const result = await loadProjects()

      expect(result).toEqual([])
    })
  })

  describe('getProjectById', () => {
    beforeEach(() => {
      vi.mocked(projectsApi.getProjectById).mockReset()
    })

    it('returns normalized project when API returns fullDescription as string', async () => {
      const raw = {
        id: 10,
        title: 'Projekt',
        description: 'Opis',
        category: 'Frontend' as const,
        stack: [],
        github: '',
        demo: '',
        fullDescription: 'treść',
      }
      vi.mocked(projectsApi.getProjectById).mockResolvedValue(raw as unknown as Project)

      const result = await getProjectById(10)

      expect(projectsApi.getProjectById).toHaveBeenCalledWith(10)
      expect(result.fullDescription).toEqual([{ type: 'text', content: 'treść' }])
    })
  })

  describe('createProject', () => {
    beforeEach(() => {
      vi.mocked(projectsApi.createProject).mockReset()
    })

    it('calls API with payload and returns normalized project', async () => {
      const payload = { title: 'Nowy', category: 'Backend' as const }
      const rawCreated = {
        id: 5,
        title: 'Nowy',
        description: '',
        category: 'Backend' as const,
        stack: [],
        github: '',
        demo: '',
        fullDescription: 'opis',
      }
      vi.mocked(projectsApi.createProject).mockResolvedValue(rawCreated as unknown as Project)

      const result = await createProject(payload)

      expect(projectsApi.createProject).toHaveBeenCalledWith(payload)
      expect(result.fullDescription).toEqual([{ type: 'text', content: 'opis' }])
    })
  })

  describe('updateProject', () => {
    beforeEach(() => {
      vi.mocked(projectsApi.updateProject).mockReset()
    })

    it('calls API with id and patch and returns normalized project', async () => {
      const patch = { title: 'Zmieniony' }
      const rawUpdated = {
        id: 3,
        title: 'Zmieniony',
        description: '',
        category: 'Frontend' as const,
        stack: [],
        github: '',
        demo: '',
        fullDescription: 'zaktualizowany opis',
      }
      vi.mocked(projectsApi.updateProject).mockResolvedValue(rawUpdated as unknown as Project)

      const result = await updateProject(3, patch)

      expect(projectsApi.updateProject).toHaveBeenCalledWith(3, patch)
      expect(result.fullDescription).toEqual([
        { type: 'text', content: 'zaktualizowany opis' },
      ])
    })

    it('calls API with patch containing attachments (no download_links)', async () => {
      const attachments = [
        { path: 'projects/3/doc.pdf', label: 'Doc', type: 'pdf' as const },
      ]
      const patch = { attachments }
      const rawUpdated = {
        id: 3,
        title: 'P',
        description: '',
        category: 'Frontend' as const,
        stack: [],
        github: '',
        demo: '',
        fullDescription: [],
        attachments,
      }
      vi.mocked(projectsApi.updateProject).mockResolvedValue(rawUpdated as unknown as Project)

      await updateProject(3, patch)

      expect(projectsApi.updateProject).toHaveBeenCalledWith(3, patch)
      expect(patch).toHaveProperty('attachments')
      expect(patch).not.toHaveProperty('download_links')
    })
  })

  describe('deleteProject', () => {
    beforeEach(() => {
      vi.mocked(projectsApi.deleteProject).mockReset()
    })

    it('calls deleteProject API with id', async () => {
      vi.mocked(projectsApi.deleteProject).mockResolvedValue(undefined)

      await deleteProject(7)

      expect(projectsApi.deleteProject).toHaveBeenCalledTimes(1)
      expect(projectsApi.deleteProject).toHaveBeenCalledWith(7)
    })
  })
})
