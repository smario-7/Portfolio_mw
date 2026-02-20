
import { ChevronLeft } from 'lucide-react'
import { ProjectDetail } from '@/components/project-detail'
import { ProjectCard } from '@/components/project-card'
import { usePortfolio } from '@/contexts/PortfolioContext'

interface ProjectsSectionProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedProjectId: number | null
  setSelectedProjectId: (id: number | null) => void
  onSelectProject: (id: number) => void
}

export function ProjectsSection({
  selectedCategory,
  setSelectedCategory,
  selectedProjectId,
  setSelectedProjectId,
  onSelectProject,
}: ProjectsSectionProps) {
  const { content, projects } = usePortfolio()
  const visibleProjects = projects.filter((p) => p.status === 'published')
  const projectFilters =
    visibleProjects.length === 0
      ? []
      : ['Wszystkie', ...[...new Set(visibleProjects.map((p) => p.category))].sort()]
  const filteredProjects =
    selectedCategory === 'Wszystkie'
      ? visibleProjects
      : visibleProjects.filter((p) => p.category === selectedCategory)

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const orderA = a.order ?? a.id
    const orderB = b.order ?? b.id
    return orderA - orderB
  })

  if (selectedProjectId) {
    return (
      <section className="space-y-6">
        <button
          onClick={() => setSelectedProjectId(null)}
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Wróć do projektów
        </button>
        <ProjectDetail projectId={selectedProjectId} />
      </section>
    )
  }

  const projectsTitle = content.home?.projectsTitle ?? 'Moje Projekty'
  const projectsDescription =
    content.home?.projectsDescription ??
    'Tworzę systemy webowe, aplikacje AI i narzędzia do analizy danych.'

  return (
    <section className="space-y-12">
      <div className="space-y-4">
        <h2 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
          {projectsTitle}
        </h2>
        <p className="text-lg text-muted-foreground">
          {projectsDescription}
        </p>
      </div>

      {projectFilters.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {projectFilters.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={onSelectProject}
          />
        ))}
      </div>
    </section>
  )
}
