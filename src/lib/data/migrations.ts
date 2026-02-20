import type { ContentData } from '@/lib/types'
import type { Project } from '@/lib/types'

export function migrateContentCourses(content: ContentData): ContentData {
  const courses = content.about?.courses ?? []
  if (courses.every((c) => c.id !== undefined && c.order !== undefined)) {
    return content
  }
  const migratedCourses = courses.map((course, index) => ({
    ...course,
    id: course.id ?? index + 1,
    order: course.order ?? course.id ?? index + 1,
  }))
  return {
    ...content,
    about: {
      ...content.about,
      courses: migratedCourses,
    },
  }
}

export function migrateProjectsOrder(projects: Project[]): Project[] {
  if (projects.every((p) => p.order !== undefined)) {
    return projects
  }
  return projects.map((project) => ({
    ...project,
    order: project.order ?? project.id,
  }))
}
