import type { Project } from '@/lib/types'

interface ProjectDetailStackProps {
  project: Project
}

export function ProjectDetailStack({ project }: ProjectDetailStackProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {project.stack.map((tech) => (
        <span
          key={tech}
          className="rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary"
        >
          {tech}
        </span>
      ))}
    </div>
  )
}
