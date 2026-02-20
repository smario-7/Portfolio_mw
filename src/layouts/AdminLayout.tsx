import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { Sidebar } from '@/components/admin/Sidebar'
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

  const isLoginPage = pathname === '/admin/login'
  if (!session && !isLoginPage) {
    return <Navigate to="/admin/login" replace />
  }
  if (session && isLoginPage) {
    return <Navigate to="/admin/dashboard" replace />
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
