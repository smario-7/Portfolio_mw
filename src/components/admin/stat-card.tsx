import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  color: string
  onClick?: () => void
}

export function StatCard({ label, value, icon: Icon, color, onClick }: StatCardProps) {
  const content = (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
      <div className={`rounded-lg p-3 ${color}`}>
        <Icon className="h-6 w-6 text-foreground" />
      </div>
    </div>
  )

  const className =
    'rounded-lg border-2 border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 transition-colors'

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(className, 'cursor-pointer text-left w-full')}
      >
        {content}
      </button>
    )
  }

  return <div className={className}>{content}</div>
}
