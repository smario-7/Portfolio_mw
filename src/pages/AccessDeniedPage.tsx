import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { ADMIN_DASHBOARD, HOME } from '@/lib/constants/routes'
import { getFullUrlForRoute } from '@/lib/constants/app-url'
import { signInWithGoogle, isAuthAvailable } from '@/lib/supabase/auth'
import { AuthCardShell } from '@/components/admin/AuthCardShell'
import { GoogleSignInButton } from '@/components/admin/GoogleSignInButton'

export default function AccessDeniedPage() {
  const [loading, setLoading] = useState(false)
  const redirectTo = useMemo(() => getFullUrlForRoute(ADMIN_DASHBOARD), [])

  const handleGoogleLogin = () => {
    setLoading(true)
    signInWithGoogle(redirectTo)
  }

  return (
    <AuthCardShell badge="Brak dostępu">
      <div className="space-y-3 text-center pt-2">
        <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Brak uprawnień</h1>
        <p className="text-base text-muted-foreground">
          Drogi użytkowniku, nie masz uprawnień do tej sekcji strony.
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card/50 px-2 text-muted-foreground">Logowanie</span>
        </div>
      </div>

      <div className="space-y-3">
        {isAuthAvailable() && <GoogleSignInButton onClick={handleGoogleLogin} loading={loading} />}
        <Link
          to={HOME}
          className="w-full flex items-center justify-center rounded-lg border-2 border-transparent px-6 py-3 font-medium text-muted-foreground transition-all hover:text-primary"
        >
          Powrót do strony głównej
        </Link>
      </div>
    </AuthCardShell>
  )
}
