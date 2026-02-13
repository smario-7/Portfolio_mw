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
import * as contentService from '@/lib/services/content-service'
import * as projectsService from '@/lib/services/projects-service'
import { toast } from 'sonner'

interface PortfolioContextValue {
  content: ContentData
  setContent: (content: ContentData | ((prev: ContentData) => ContentData)) => void
  projects: Project[]
  projectFilters: string[]
  setProjects: (projects: Project[] | ((prev: Project[]) => Project[])) => void
  addProject: (project: Omit<Project, 'id'> | Project) => void
  updateProject: (id: number, patch: Partial<Project>) => void
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
    Promise.all([contentService.loadContent(), projectsService.loadProjects()])
      .then(([contentData, projectsData]) => {
        if (cancelled) return
        setContentState(contentData)
        setProjectsState(projectsData)
        setError(null)
      })
      .catch(() => {
        if (cancelled) return
        Promise.all([contentService.loadContent(), projectsService.loadProjects()])
          .then(([contentData, projectsData]) => {
            if (cancelled) return
            setContentState(contentData)
            setProjectsState(projectsData)
            setError('Nie załadowano danych z serwera, używane są dane z sesji.')
          })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
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
        projectsService.saveProjects(next).catch(() => {
          toast.error('Zapis do pliku nie powiódł się, dane tylko w tej sesji.')
        })
        return next
      })
    },
    []
  )

  const addProject = useCallback(
    (project: Omit<Project, 'id'> | Project) => {
      setProjectsState((prev) => {
        const id =
          'id' in project && project.id != null
            ? project.id
            : projectsService.nextProjectId(prev)
        const newProject: Project = {
          ...project,
          id,
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

  const updateProject = useCallback((id: number, patch: Partial<Project>) => {
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
  }, [])

  const deleteProject = useCallback((id: number) => {
    setProjectsState((prev) => {
      const next = prev.filter((p) => p.id !== id)
      projectsService.saveProjects(next).catch(() => {
        toast.error('Zapis do pliku nie powiódł się, dane tylko w tej sesji.')
      })
      return next
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
