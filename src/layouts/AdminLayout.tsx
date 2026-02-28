import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { Sidebar } from '@/components/admin/Sidebar'
import { ADMIN_LOGIN, ADMIN_DASHBOARD } from '@/lib/constants/routes'
import { ADMIN_MAIN_PADDING_CLASS } from '@/lib/constants/layout'
import { useAdminSession } from '@/hooks/use-admin-session'

export default function AdminLayout() {
  const { pathname } = useLocation()
  const { session, authLoading } = useAdminSession()

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Ładowanie…</p>
      </div>
    )
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
