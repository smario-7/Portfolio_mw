import { cn } from '@/lib/utils'

interface CodeBlockPlaceholderProps {
  variant: 'loading' | 'error'
  className?: string
}

const MESSAGES = {
  loading: 'Ładowanie fragmentu kodu…',
  error: 'Brak pliku',
} as const

export function CodeBlockPlaceholder({ variant, className }: CodeBlockPlaceholderProps) {
  return (
    <div
      className={cn(
        'flex min-h-[120px] items-center justify-center rounded-lg border border-border bg-card/30 text-sm text-muted-foreground',
        className
      )}
    >
      {MESSAGES[variant]}
    </div>
  )
}
