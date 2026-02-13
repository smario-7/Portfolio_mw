import {
  Briefcase,
  Code,
  Zap,
  GitBranch,
  Terminal,
  MessageCircle,
  Container,
  GraduationCap,
  Sparkles,
  Code2,
  Braces,
  Layers,
  Server,
  Database,
  Palette,
  Cloud,
  Brain,
  Workflow,
  Github,
  Coffee,
  Leaf,
  Hexagon,
  Circle,
  Box,
  Play,
  Cog,
  FlaskConical,
  TestTube,
  Package,
  type LucideIcon,
} from 'lucide-react'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { getToolsCatalog } from '@/lib/services/projects-service'

const iconNameToComponent: Record<string, LucideIcon> = {
  Briefcase,
  Code,
  Zap,
  GraduationCap,
  Sparkles,
  GitBranch,
  Terminal,
  MessageCircle,
  Container,
  Code2,
  Braces,
  Layers,
  Server,
  Database,
  Palette,
  Cloud,
  Brain,
  Workflow,
  Github,
  Coffee,
  Leaf,
  Hexagon,
  Circle,
  Box,
  Play,
  Cog,
  FlaskConical,
  TestTube,
  Package,
}

function getToolIcon(iconName?: string): LucideIcon {
  if (!iconName?.trim()) return Code
  const Icon = iconNameToComponent[iconName.trim()]
  return Icon ?? Code
}

export function AboutSection() {
  const { content } = usePortfolio()
  const catalog = getToolsCatalog()
  const toolIds = content.about?.tools ?? []
  const selectedTools = toolIds
    .map((id) => catalog.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => t != null)
  const skillsByCategory = content.about?.skills ?? {}
  const nonEmptySkillCategories = Object.entries(skillsByCategory).filter(
    ([, arr]) => (arr?.length ?? 0) > 0
  )

  const introduction = content.about?.introduction ?? ''
  const introductionParagraphs = introduction
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
  const courses = content.about?.courses ?? []

  const monthNames = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ]

  const formatDate = (year: number, month: number): string => {
    return `${monthNames[month - 1]} ${year}`
  }

  return (
    <section className="space-y-16">
      <div className="space-y-8">
        <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          O mnie
        </h1>
        {introductionParagraphs.length > 0 && (
          <div className="space-y-6 rounded-xl border-2 border-border bg-card/50 p-6 shadow-sm md:p-8">
            <div className="border-l-2 border-primary pl-6">
              {introductionParagraphs.map((para, i) => (
                <p
                  key={i}
                  className="text-lg leading-relaxed text-foreground"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {courses.length > 0 && (
        <div className="rounded-xl border-2 border-border bg-card/40 p-6 md:p-8">
          <h2 className="pb-2 mb-6 border-b border-border text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Kursy
          </h2>
          <div className="space-y-6">
            {courses.map((course, i) => (
              <div
                key={i}
                className="hover-lift rounded-lg border-2 border-border bg-card/30 p-6 transition-all hover:border-primary"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 text-sm font-medium text-muted-foreground">
                      {formatDate(course.completionDate.year, course.completionDate.month)}
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">
                      {course.courseName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {course.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {nonEmptySkillCategories.length > 0 && (
        <div className="rounded-xl border-2 border-border bg-card/40 p-6 md:p-8">
          <h2 className="pb-2 mb-6 border-b border-border text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Umiejętności
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {nonEmptySkillCategories.map(([title, skills]) => (
              <div
                key={title}
                className="hover-lift rounded-lg border-2 border-border bg-card/30 p-6 transition-all hover:border-primary"
              >
                <h3 className="mb-4 font-semibold text-primary">{title}</h3>
                <ul className="grid gap-2">
                  {skills.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-center gap-3"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">
                        {skill}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTools.length > 0 && (
        <div className="rounded-xl border-2 border-border bg-card/40 p-6 md:p-8">
          <h2 className="pb-2 mb-6 border-b border-border text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Narzędzia & Technologie
          </h2>
          <div className="grid gap-6 md:grid-cols-5">
            {selectedTools.map((tool) => {
              const Icon = getToolIcon(tool.icon)
              return (
                <div
                  key={tool.id}
                  className="hover-lift flex flex-col items-center gap-4 rounded-lg border-2 border-border bg-card/30 p-6 transition-all hover:border-primary hover:bg-card/50"
                >
                  <Icon className="h-8 w-8 text-primary" />
                  <span className="font-medium">{tool.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
