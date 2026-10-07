import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { Sidebar } from '@/components/admin/Sidebar'
import { ACCESS_DENIED, ADMIN_LOGIN, ADMIN_DASHBOARD } from '@/lib/constants/routes'
import { ADMIN_MAIN_PADDING_CLASS } from '@/lib/constants/layout'
import { useAdminSession } from '@/hooks/use-admin-session'
import { isSignupDeniedError } from '@/lib/supabase/auth'

export default function AdminLayout() {
  const { pathname, search, hash } = useLocation()
  const { session, authLoading, accessDenied } = useAdminSession()

  // Przekierowanie na login gubi query z błędem OAuth, więc rozpoznajemy odmowę zanim do niego dojdzie
  if (isSignupDeniedError(search, hash)) {
    return <Navigate to={ACCESS_DENIED} replace />
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Ładowanie…</p>
      </div>
    )
  }

  if (accessDenied) {
    return <Navigate to={ACCESS_DENIED} replace />
  }

  const isLoginPage = pathname === ADMIN_LOGIN
  if (!session && !isLoginPage) {
    return <Navigate to={ADMIN_LOGIN} replace />
  }
  if (session && isLoginPage) {
    return <Navigate to={ADMIN_DASHBOARD} replace />
  }
  if (isLoginPage) {
    return <Outlet />
  }

  return (
    <div className="flex h-screen min-h-0 bg-background">
      <Sidebar />
      <main className={ADMIN_MAIN_PADDING_CLASS}>
        <Outlet />
      </main>
    </div>
  )
}
