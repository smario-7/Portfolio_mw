import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ContentData } from '@/lib/types/content'
import type { Project } from '@/lib/types'
import { DEFAULT_CONTENT } from '@/lib/data/content-defaults'
import { projects as defaultProjects } from '@/lib/data/projects'
import { migrateContentCourses, migrateProjectsOrder } from '@/lib/data/migrations'
import * as contentService from '@/lib/services/content-service'
import * as projectsService from '@/lib/services/projects-service'
import { deleteProjectStorage } from '@/lib/api/storage-api'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

/**
 * Przy Supabase lista i zapis projektów odbywa się przez createProject / updateProject / deleteProject.
 * addProject i saveProjects służą wyłącznie fallbackowi Express.
 */
interface PortfolioContextValue {
  content: ContentData
  setContent: (content: ContentData | ((prev: ContentData) => ContentData)) => void
  projects: Project[]
  projectFilters: string[]
  setProjects: (projects: Project[] | ((prev: Project[]) => Project[])) => void
  /** Przy Supabase no-op – nowe projekty tworz przez createProject. Dla Express: dodaje projekt do listy i zapisuje. */
  addProject: (project: Omit<Project, 'id'> | Project) => void
  createProject: (payload?: Partial<Project>) => Promise<Project>
  updateProject: (id: number, patch: Partial<Project>) => Promise<void>
  deleteProject: (id: number) => void
  loading: boolean
  error: string | null
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<ContentData>(DEFAULT_CONTENT)
  const [projects, setProjectsState] = useState<Project[]>(defaultProjects)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    function applyMigrationsAndSave(
      contentData: ContentData,
      projectsData: Project[]
    ): { content: ContentData; projects: Project[] } {
      try {
        const content = migrateContentCourses(contentData)
        const projects = migrateProjectsOrder(projectsData)
        if (content !== contentData) {
          contentService.saveContent(content).catch(() => {})
        }
        if (projects !== projectsData && !supabase) {
          projectsService.saveProjects(projects).catch(() => {})
        }
        return { content, projects }
      } catch (err) {
        console.error('Error in applyMigrationsAndSave:', err)
        return { content: contentData, projects: projectsData }
      }
    }

    function onLoaded(contentData: ContentData, projectsData: Project[], errMessage: string | null) {
      if (cancelled) return
      try {
        const { content, projects } = applyMigrationsAndSave(contentData, projectsData)
        setContentState(content)
        setProjectsState(projects)
        setError(errMessage)
      } catch (err) {
        console.error('Error applying migrations:', err)
        if (!cancelled) {
          setContentState(migrateContentCourses(DEFAULT_CONTENT))
          setProjectsState(migrateProjectsOrder(defaultProjects))
          setError('Błąd podczas przetwarzania danych')
        }
      }
    }

    function finishLoading() {
      if (!cancelled) {
        setLoading(false)
      }
    }

    function loadData() {
      try {
        if (!supabase) {
          setContentState(migrateContentCourses(DEFAULT_CONTENT))
          setProjectsState(migrateProjectsOrder(defaultProjects))
          setError('Skonfiguruj Supabase (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)')
          finishLoading()
          return
        }

        const LOAD_TIMEOUT_MS = 10000

        // Przy skonfigurowanym Supabase lista projektów jest ładowana wyłącznie z tabeli `projects` (projectsRepository.list()).
        Promise.all([
          contentService.loadContent(),
          projectsService.loadProjects()
        ])
          .then(([contentData, projectsData]) => {
            if (cancelled) return
            if (timeoutId) {
              clearTimeout(timeoutId)
              timeoutId = null
            }
            onLoaded(contentData, projectsData, null)
            finishLoading()
          })
          .catch((err) => {
            if (cancelled) return
            if (timeoutId) {
              clearTimeout(timeoutId)
              timeoutId = null
            }
            console.error('Error loading data:', err)
            setContentState(migrateContentCourses(DEFAULT_CONTENT))
            setProjectsState(migrateProjectsOrder(defaultProjects))
            setError('Brak danych, nie połączono z bazą')
            finishLoading()
          })

        timeoutId = setTimeout(() => {
          if (!cancelled) {
            console.warn('Data loading timeout after', LOAD_TIMEOUT_MS, 'ms')
            setContentState(migrateContentCourses(DEFAULT_CONTENT))
            setProjectsState(migrateProjectsOrder(defaultProjects))
            setError('Timeout podczas ładowania danych')
            finishLoading()
          }
        }, LOAD_TIMEOUT_MS)
      } catch (err) {
        console.error('Unexpected error in loadData:', err)
        if (!cancelled) {
          setContentState(migrateContentCourses(DEFAULT_CONTENT))
          setProjectsState(migrateProjectsOrder(defaultProjects))
          setError('Nieoczekiwany błąd podczas inicjalizacji')
          finishLoading()
        }
      }
    }

    const initTimeout = setTimeout(() => {
      loadData()
    }, 0)

    return () => {
      cancelled = true
      clearTimeout(initTimeout)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  const setContent = useCallback(
    (value: ContentData | ((prev: ContentData) => ContentData)) => {
      setContentState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value
        contentService.saveContent(next).catch(() => {
          toast.error('Zapis do pliku nie powiódł się, dane tylko w tej sesji.')
        })
        return next
      })
    },
    []
  )

  const setProjects = useCallback(
    (value: Project[] | ((prev: Project[]) => Project[])) => {
      setProjectsState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value
        if (!supabase) {
          projectsService.saveProjects(next).catch(() => {
            toast.error('Zapis do pliku nie powiódł się, dane tylko w tej sesji.')
          })
        }
        return next
      })
    },
    []
  )

  const createProject = useCallback(async (payload?: Partial<Project>): Promise<Project> => {
    const newProject = await projectsService.createProject(payload)
    setProjectsState((prev) => [...prev, newProject])
    return newProject
  }, [])

  const addProject = useCallback(
    (project: Omit<Project, 'id'> | Project) => {
      if (supabase) return // no-op; use createProject for new projects
      setProjectsState((prev) => {
        const id =
          'id' in project && project.id != null
            ? project.id
            : projectsService.nextProjectId(prev)
        const maxOrder = prev.length > 0
          ? Math.max(...prev.map((p) => p.order ?? p.id), 0)
          : 0
        const newProject: Project = {
          ...project,
          id,
          order: 'order' in project && project.order != null
            ? project.order
            : maxOrder + 1,
        } as Project
        const next = [...prev, newProject]
        projectsService.saveProjects(next).catch(() => {
          toast.error('Zapis do pliku nie powiódł się, dane tylko w tej sesji.')
        })
        return next
      })
    },
    []
  )

  const updateProject = useCallback((id: number, patch: Partial<Project>): Promise<void> => {
    if (supabase) {
      return projectsService
        .updateProject(id, patch)
        .then((updated) => {
          setProjectsState((prev) =>
            prev.map((p) => (p.id === id ? updated : p))
          )
        })
        .catch(() => {
          toast.error('Nie udało się zapisać projektu.')
          throw new Error('Update failed')
        })
    }
    setProjectsState((prev) => {
      const index = prev.findIndex((p) => p.id === id)
      if (index === -1) return prev
      const next = [...prev]
      next[index] = { ...next[index], ...patch }
      projectsService.saveProjects(next).catch(() => {
        toast.error('Zapis do pliku nie powiódł się, dane tylko w tej sesji.')
      })
      return next
    })
    return Promise.resolve()
  }, [])

  const deleteProject = useCallback((id: number) => {
    const removeFromState = () => {
      setProjectsState((prev) => prev.filter((p) => p.id !== id))
    }
    if (supabase) {
      deleteProjectStorage(id)
        .catch(() => {})
        .then(() => projectsService.deleteProject(id))
        .then(removeFromState)
        .catch(() => {
          toast.error('Nie udało się usunąć projektu.')
        })
      return
    }
    deleteProjectStorage(id).finally(() => {
      setProjectsState((prev) => {
        const next = prev.filter((p) => p.id !== id)
        projectsService.saveProjects(next).catch(() => {
          toast.error('Zapis do pliku nie powiódł się, dane tylko w tej sesji.')
        })
        return next
      })
    })
  }, [])

  const projectFilters = useMemo(
    () => projectsService.getProjectFilters(projects),
    [projects]
  )

  const value = useMemo<PortfolioContextValue>(
    () => ({
      content,
      setContent,
      projects,
      projectFilters,
      setProjects,
      addProject,
      createProject,
      updateProject,
      deleteProject,
      loading,
      error,
    }),
    [
      content,
      setContent,
      projects,
      projectFilters,
      setProjects,
      addProject,
      createProject,
      updateProject,
      deleteProject,
      loading,
      error,
    ]
  )

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext)
  if (!ctx) {
    throw new Error('usePortfolio must be used within PortfolioProvider')
  }
  return ctx
}
