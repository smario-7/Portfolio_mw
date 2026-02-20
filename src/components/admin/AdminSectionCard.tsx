import { cn } from '@/lib/utils'
import { ADMIN_SECTION_CARD_CLASS } from '@/lib/constants/layout'

interface AdminSectionCardProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export function AdminSectionCard({
  children,
  title,
  description,
  className,
}: AdminSectionCardProps) {
  return (
    <div
      className={cn(
        ADMIN_SECTION_CARD_CLASS,
        'space-y-6',
        className
      )}
    >
      {title != null && (
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      )}
      {description != null && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  )
}
