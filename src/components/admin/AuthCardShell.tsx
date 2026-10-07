import type { ReactNode } from 'react'
import { Shield } from 'lucide-react'

interface AuthCardShellProps {
  badge: string
  children: ReactNode
}

/** Wspólna oprawa (tło, karta, odznaka) dla stron logowania i braku uprawnień. */
export function AuthCardShell({ badge, children }: AuthCardShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border-2 border-border bg-card/50 backdrop-blur-sm p-8 space-y-8 shadow-lg relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-sm border-2 border-border px-3 py-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">{badge}</span>
          </div>
          {children}
        </div>

        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}
