import { Lock } from 'lucide-react'

interface GoogleSignInButtonProps {
  onClick: () => void
  loading?: boolean
}

export function GoogleSignInButton({ onClick, loading = false }: GoogleSignInButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-border bg-background px-6 py-3 font-medium text-foreground transition-all hover:bg-card hover:border-primary hover:text-primary active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
    >
      <Lock className="h-5 w-5" />
      <span>{loading ? 'Przekierowuję…' : 'Zaloguj się przez Google'}</span>
    </button>
  )
}
