'use client'

import { Badge } from '@/components/ui/badge'

interface SkillBadgeProps {
  name: string
  icon?: string
}

export function SkillBadge({ name, icon }: SkillBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="cursor-pointer border-primary/40 bg-primary/5 px-4 py-2 text-sm transition-all hover:scale-105 hover:border-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20"
    >
      {icon && <span className="mr-2">{icon}</span>}
      {name}
    </Badge>
  )
}
