import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { ContentData } from '@/lib/types'
import type { Project } from '@/lib/types'
import { DEFAULT_CONTENT } from '@/lib/data/content-defaults'
import { projects as defaultProjects } from '@/lib/data/projects'
import { migrateContentCourses, migrateProjectsOrder } from '@/lib/data/migrations'
import * as contentService from '@/lib/services/content-service'
import * as projectsService from '@/lib/services/projects-service'
import * as storageService from '@/lib/services/storage-service'
import { supabase } from '@/lib/supabase/client'
import { getSession, isSessionValid } from '@/lib/supabase/auth'
import { toast } from 'sonner'
import { CONTENT_SAVE_DEBOUNCE_MS, LOAD_TIMEOUT_MS } from '@/lib/constants/context-save'
import {
  DataLoadError,
  DataLoadTimeoutError,
  DataMigrationError,
  ContentSaveError,
  ProjectsSaveError,
  ProjectUpdateError,
  ProjectDeleteError,
  ProjectStorageDeleteError,
  reportError,
} from '@/lib/errors'

/** Kontekst treści (content) – zmiana projects nie powoduje przerenderu konsumentów. */
export interface ContentContextValue {
  content: ContentData
  setContent: (content: ContentData | ((prev: ContentData) => ContentData)) => void
  /** Ustawia treść tylko w stanie (bez zapisu). Używane np. po zapisie z formularza admina. */
  replaceContent: (content: ContentData) => void
  loading: boolean
  error: string | null
}

/** Kontekst projektów – zmiana content nie powoduje przerenderu konsumentów. */
export interface ProjectsContextValue {
  projects: Project[]
  projectFilters: string[]
  setProjects: (projects: Project[] | ((prev: Project[]) => Project[])) => void
  /** Przy Supabase no-op – nowe projekty tworz przez createProject. */
  addProject: (project: Omit<Project, 'id'> | Project) => void
  createProject: (payload?: Partial<Project>) => Promise<Project>
  updateProject: (id: number, patch: Partial<Project>) => Promise<Project>
  deleteProject: (id: number) => void
  loading: boolean
  error: string | null
  /** True gdy backend to Supabase – zapis listy wymaga wywołań updateProject, nie tylko setProjects. */
  useSupabase: boolean
}

const ContentContext = createContext<ContentContextValue | null>(null)
const ProjectsContext = createContext<ProjectsContextValue | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<ContentData>(DEFAULT_CONTENT)
  const [projects, setProjectsState] = useState<Project[]>(defaultProjects)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lastSavedContentRef = useRef<ContentData | null>(null)
  const lastSavedProjectsRef = useRef<Project[] | null>(null)

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
        return { content, projects }
      } catch (err) {
        reportError(new DataMigrationError('applyMigrationsAndSave', err), {
          context: 'applyMigrationsAndSave',
        })
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
        const msg = reportError(new DataMigrationError('onLoaded migrations', err), {
          context: 'onLoaded_migrations',
        })
        if (!cancelled) {
          setContentState(migrateContentCourses(DEFAULT_CONTENT))
          setProjectsState(migrateProjectsOrder(defaultProjects))
          setError(msg)
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
            const msg = reportError(new DataLoadError('loadData', err), {
              context: 'loadData',
            })
            setContentState(migrateContentCourses(DEFAULT_CONTENT))
            setProjectsState(migrateProjectsOrder(defaultProjects))
            setError(msg)
            finishLoading()
          })

        timeoutId = setTimeout(() => {
          if (!cancelled) {
            const msg = reportError(new DataLoadTimeoutError('Timeout podczas ładowania danych'), {
              context: 'loadData_timeout',
            })
            setContentState(migrateContentCourses(DEFAULT_CONTENT))
            setProjectsState(migrateProjectsOrder(defaultProjects))
            setError(msg)
            finishLoading()
          }
        }, LOAD_TIMEOUT_MS)
      } catch (err) {
        if (!cancelled) {
          const msg = reportError(err, { context: 'loadData_sync' })
          setContentState(migrateContentCourses(DEFAULT_CONTENT))
          setProjectsState(migrateProjectsOrder(defaultProjects))
          setError(msg)
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

  useEffect(() => {
    if (lastSavedContentRef.current === null) {
      lastSavedContentRef.current = content
      return
    }
    if (content === lastSavedContentRef.current) {
      return
    }
    let cancelled = false
    const timeoutId = setTimeout(async () => {
      const { data: { session } } = await getSession()
      if (cancelled || !session || !isSessionValid(session)) return
      contentService
        .saveContent(content)
        .then(() => {
          if (!cancelled) lastSavedContentRef.current = content
        })
        .catch((err) => {
          if (cancelled) return
          const msg = reportError(new ContentSaveError('saveContent', err), {
            context: 'content_save',
          })
          toast.error(msg)
        })
    }, CONTENT_SAVE_DEBOUNCE_MS)
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [content])

  useEffect(() => {
    if (lastSavedProjectsRef.current === null) {
      lastSavedProjectsRef.current = projects
      return
    }
    if (projects === lastSavedProjectsRef.current) {
      return
    }
    let cancelled = false
    const timeoutId = setTimeout(async () => {
      const { data: { session } } = await getSession()
      if (cancelled || !session || !isSessionValid(session)) return
      projectsService
        .saveProjects(projects)
        .then(() => {
          if (!cancelled) lastSavedProjectsRef.current = projects
        })
        .catch((err) => {
          if (cancelled) return
          const msg = reportError(new ProjectsSaveError('saveProjects', err), {
            context: 'projects_save',
          })
          toast.error(msg)
        })
    }, CONTENT_SAVE_DEBOUNCE_MS)
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [projects])

  const setContent = useCallback(
    (value: ContentData | ((prev: ContentData) => ContentData)) => {
      setContentState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value
        return next
      })
    },
    []
  )

  const replaceContent = useCallback((content: ContentData) => {
    lastSavedContentRef.current = content
    setContentState(content)
  }, [])

  const setProjects = useCallback(
    (value: Project[] | ((prev: Project[]) => Project[])) => {
      setProjectsState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value
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
        return [...prev, newProject]
      })
    },
    []
  )

  const updateProject = useCallback((id: number, patch: Partial<Project>): Promise<Project> => {
    if (supabase) {
      return projectsService
        .updateProject(id, patch)
        .then((updated) => {
          setProjectsState((prev) =>
            prev.map((p) => (p.id === id ? updated : p))
          )
          return updated
        })
        .catch((err) => {
          const msg = reportError(new ProjectUpdateError('updateProject', err), {
            context: 'update_project',
          })
          toast.error(msg)
          throw new ProjectUpdateError('Update failed', err)
        })
    }
    let updated: Project | undefined
    setProjectsState((prev) => {
      const index = prev.findIndex((p) => p.id === id)
      if (index === -1) return prev
      const next = [...prev]
      updated = { ...next[index], ...patch } as Project
      next[index] = updated
      return next
    })
    if (updated === undefined) {
      return Promise.reject(new Error('Project not found'))
    }
    return Promise.resolve(updated)
  }, [])

  const deleteProject = useCallback((id: number) => {
    const removeFromState = () => {
      setProjectsState((prev) => prev.filter((p) => p.id !== id))
    }
    if (supabase) {
      storageService.deleteProjectStorage(id).then(
        () =>
          projectsService
            .deleteProject(id)
            .then(removeFromState)
            .catch((err) => {
              const msg = reportError(new ProjectDeleteError('deleteProject', err), {
                context: 'delete_project',
              })
              toast.error(msg)
            }),
        (err) => {
          const msg = reportError(new ProjectStorageDeleteError('deleteProjectStorage', err), {
            context: 'delete_project_storage',
          })
          toast.error(msg)
        }
      )
      return
    }
    storageService.deleteProjectStorage(id)
      .then(() => {
        setProjectsState((prev) => prev.filter((p) => p.id !== id))
      })
      .catch((err) => {
        const msg = reportError(new ProjectStorageDeleteError('deleteProjectStorage', err), {
          context: 'delete_project_storage_fallback',
        })
        toast.error(msg)
      })
  }, [])

  const projectFilters = useMemo(
    () => projectsService.getProjectFilters(projects),
    [projects]
  )

  const useSupabase = Boolean(supabase)

  const contentValue = useMemo<ContentContextValue>(
    () => ({
      content,
      setContent,
      replaceContent,
      loading,
      error,
    }),
    [content, setContent, replaceContent, loading, error]
  )

  const projectsValue = useMemo<ProjectsContextValue>(
    () => ({
      projects,
      projectFilters,
      setProjects,
      addProject,
      createProject,
      updateProject,
      deleteProject,
      loading,
      error,
      useSupabase,
    }),
    [
      projects,
      projectFilters,
      setProjects,
      addProject,
      createProject,
      updateProject,
      deleteProject,
      loading,
      error,
      useSupabase,
    ]
  )

  return (
    <ContentContext.Provider value={contentValue}>
      <ProjectsContext.Provider value={projectsValue}>
        {children}
      </ProjectsContext.Provider>
    </ContentContext.Provider>
  )
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext)
  if (!ctx) {
    throw new Error('useContent must be used within PortfolioProvider')
  }
  return ctx
}

export function useProjects(): ProjectsContextValue {
  const ctx = useContext(ProjectsContext)
  if (!ctx) {
    throw new Error('useProjects must be used within PortfolioProvider')
  }
  return ctx
}

/** Łączy useContent i useProjects – dla komponentów potrzebujących obu (np. HomePage, ProjectsSection). */
export function usePortfolio(): ContentContextValue & ProjectsContextValue {
  const content = useContent()
  const projects = useProjects()
  return { ...content, ...projects }
}
