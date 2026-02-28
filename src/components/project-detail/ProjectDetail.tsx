import { useProjects } from '@/contexts/PortfolioContext'
import type { Project } from '@/lib/types'
import { ProjectDetailHeader } from './ProjectDetailHeader'
import { ProjectDetailLead } from './ProjectDetailLead'
import { ProjectDetailStack } from './ProjectDetailStack'
import { ProjectDetailLinks } from './ProjectDetailLinks'
import { ProjectDetailAttachments } from './ProjectDetailAttachments'
import { ProjectDetailFullDescription } from './ProjectDetailFullDescription'

type ProjectDetailProps =
  | { project: Project }
  | { projectId: number }

export function ProjectDetail(props: ProjectDetailProps) {
  const { projects } = useProjects()
  const project =
    'project' in props
      ? props.project
      : projects.find((p) => p.id === props.projectId)
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
