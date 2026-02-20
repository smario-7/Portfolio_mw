import { getTechIconName, getToolIcon } from '@/lib/constants/tech-icons'
import { cn } from '@/lib/utils'

interface TechIconProps {
  tech: string
  className?: string
  title?: string
}

/**
 * Komponent wyświetlający ikonę technologii z Lucide.
 * Automatycznie dopasowuje ikonę na podstawie nazwy technologii z katalogu.
 * Dla technologii spoza katalogu wyświetla ikonę Code jako fallback.
 */
export function TechIcon({ tech, className, title }: TechIconProps) {
  const iconName = getTechIconName(tech)
  const Icon = getToolIcon(iconName)
  const displayTitle = title ?? tech

  return (
    <span title={displayTitle} className="inline-flex items-center">
      <Icon
        className={cn('text-muted-foreground', className)}
        aria-hidden="true"
      />
    </span>
  )
}
