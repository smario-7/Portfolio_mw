import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react'
import type { Project } from '@/lib/types'

interface ProjectCardProps {
  project: Project
  onSelect?: (projectId: number) => void
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const { id, title, description, stack, color, github, demo } = project
  const Wrapper = onSelect ? 'button' : 'div'
  const wrapperProps = onSelect
    ? {
        type: 'button' as const,
        onClick: () => onSelect(id),
        className: 'w-full text-left',
      }
    : {}

  return (
    <Wrapper {...wrapperProps}>
      <Card className="group hover-lift overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-primary/10">
        <div className="relative h-32 overflow-hidden bg-muted">
          <div className={`absolute inset-0 bg-gradient-to-br ${color ?? 'from-primary/20 via-accent/10 to-transparent'}`} />
        </div>
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-sm leading-relaxed line-clamp-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {stack.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex gap-4">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={(e) => onSelect && e.stopPropagation()}
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={(e) => onSelect && e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
              <span>Demo</span>
            </a>
          </div>
        </CardContent>
        <CardFooter>
          {onSelect ? (
            <span className="flex w-full items-center justify-center gap-2 text-sm font-medium">
              Zobacz szczegóły
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          ) : (
            <Button variant="outline" className="w-full gap-2 bg-transparent group-hover:bg-primary group-hover:text-primary-foreground" asChild>
              <a href={demo} target="_blank" rel="noopener noreferrer">
                Zobacz szczegóły
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </Wrapper>
  )
}
