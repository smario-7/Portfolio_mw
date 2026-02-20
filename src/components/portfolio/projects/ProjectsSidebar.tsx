import { useRef, useState, useEffect } from 'react'
import type { RefObject } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Project } from '@/lib/types'
import { ProjectsSidebarItem } from './ProjectsSidebarItem'
import { List } from 'lucide-react'

interface ProjectsSidebarProps {
  projects: Project[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedProjectId: number | null
  onSelectProject: (id: number) => void
  onBackToList?: () => void
  tabletContainerRef: RefObject<HTMLDivElement | null>
  zoomClosing?: boolean
}

export function ProjectsSidebar({
  projects,
  selectedCategory,
  onCategoryChange,
  selectedProjectId,
  onSelectProject,
  onBackToList,
  tabletContainerRef,
  zoomClosing = false,
}: ProjectsSidebarProps) {
  const categories =
    projects.length === 0
      ? []
      : ['Wszystkie', ...[...new Set(projects.map((p) => p.category))].sort()]

  const filteredProjects =
    selectedCategory === 'Wszystkie'
      ? projects
      : projects.filter((p) => p.category === selectedCategory)

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const orderA = a.order ?? a.id
    const orderB = b.order ?? b.id
    return orderA - orderB
  })

  const headerRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState(120)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setHeaderHeight(el.offsetHeight)
    })
    ro.observe(el)
    setHeaderHeight(el.offsetHeight)
    return () => ro.disconnect()
  }, [])

  const handleSelectProject = (id: number) => {
    onSelectProject(id)
    tabletContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <aside
      className={`box-border relative flex h-full min-h-0 w-full min-w-0 flex-shrink-0 flex-col overflow-hidden border-r border-border bg-background/95 ${zoomClosing ? 'pointer-events-none' : ''}`}
    >
      <div ref={headerRef} className="flex flex-shrink-0 flex-col">
        {onBackToList && (
          <div className="flex-shrink-0 border-b border-border p-2">
            <button
              type="button"
              onClick={() => {
                onBackToList()
                tabletContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <List className="h-4 w-4 shrink-0" />
              Wszystkie projekty
            </button>
          </div>
        )}
        <div className="flex-shrink-0 border-b border-border p-3">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full min-w-0" size="default">
              <SelectValue placeholder="Kategoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div
        className="scrollbar-tablet absolute left-0 right-0 min-h-0 space-y-1 overflow-y-auto p-3"
        style={{ top: headerHeight, bottom: 0 }}
      >
        {sortedProjects.map((project) => (
          <ProjectsSidebarItem
            key={project.id}
            project={project}
            isSelected={selectedProjectId === project.id}
            onSelect={() => handleSelectProject(project.id)}
          />
        ))}
      </div>
    </aside>
  )
}
