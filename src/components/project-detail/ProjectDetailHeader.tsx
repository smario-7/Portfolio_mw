import type { Project } from '@/lib/types'

interface ProjectDetailHeaderProps {
  project: Project
}

export function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
  return (
    <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
      {project.title}
    </h1>
  )
}
