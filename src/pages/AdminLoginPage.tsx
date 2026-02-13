import { useNavigate } from 'react-router-dom'
import { Shield, Lock } from 'lucide-react'

export default function AdminLogin() {
  const navigate = useNavigate()

  const handleGoogleLogin = () => {
    navigate('/admin/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border-2 border-border bg-card/50 backdrop-blur-sm p-8 space-y-8 shadow-lg relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-sm border-2 border-border px-3 py-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Bezpieczne</span>
          </div>

          <div className="space-y-3 text-center pt-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Panel Administratora
            </h1>
            <p className="text-base text-muted-foreground">
              Zaloguj się, aby zarządzać treścią
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card/50 px-2 text-muted-foreground">
                Logowanie
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-border bg-background px-6 py-3 font-medium text-foreground transition-all hover:bg-card hover:border-primary hover:text-primary active:scale-95"
          >
            <Lock className="h-5 w-5" />
            <span>Zaloguj się przez Google</span>
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Bezpieczne logowanie przez konto Google
          </p>
        </div>

        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}
