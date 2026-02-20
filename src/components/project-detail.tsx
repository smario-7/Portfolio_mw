import { usePortfolio } from '@/contexts/PortfolioContext'
import {
  ProjectDetailHeader,
  ProjectDetailLead,
  ProjectDetailStack,
  ProjectDetailLinks,
  ProjectDetailAttachments,
  ProjectDetailFullDescription,
} from './project-detail/index'

interface ProjectDetailProps {
  projectId: number
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const { projects } = usePortfolio()
  const project = projects.find((p) => p.id === projectId)
  if (!project) return null

  return (
    <section className="space-y-12">
      <div className="space-y-6 border-b border-border pb-8">
        <ProjectDetailHeader project={project} />
        <ProjectDetailLead project={project} />
        <ProjectDetailStack project={project} />
        <div className="space-y-3 pt-4">
          <ProjectDetailLinks project={project} />
          <ProjectDetailAttachments project={project} />
        </div>
      </div>

      <ProjectDetailFullDescription fullDescription={project.fullDescription} />
    </section>
  )
}
