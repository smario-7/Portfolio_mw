import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_DASHBOARD } from '@/lib/constants/routes'
import { getFullUrlForRoute } from '@/lib/constants/app-url'
import { signInWithGoogle, isAuthAvailable } from '@/lib/supabase/auth'
import { AuthCardShell } from '@/components/admin/AuthCardShell'
import { GoogleSignInButton } from '@/components/admin/GoogleSignInButton'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const redirectTo = useMemo(() => getFullUrlForRoute(ADMIN_DASHBOARD), [])

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const params = new URLSearchParams(hash)
    const error = params.get('error')
    if (error) {
      setErrorMessage('Logowanie nie powiodło się. Spróbuj ponownie.')
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

  const handleGoogleLogin = () => {
    if (isAuthAvailable()) {
      setLoading(true)
      setErrorMessage(null)
      signInWithGoogle(redirectTo)
    } else {
      navigate(ADMIN_DASHBOARD)
    }
  }

  const authAvailable = isAuthAvailable()

  return (
    <AuthCardShell badge="Bezpieczne">
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

      <div className="space-y-2">
        {!authAvailable && (
          <p className="text-center text-sm text-muted-foreground">
            Logowanie niedostępne (brak konfiguracji)
          </p>
        )}
        <GoogleSignInButton onClick={handleGoogleLogin} loading={loading} />
        {errorMessage && (
          <p className="text-center text-sm text-destructive">{errorMessage}</p>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Bezpieczne logowanie przez konto Google
      </p>
    </AuthCardShell>
  )
}
