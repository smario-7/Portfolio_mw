import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/admin/sidebar'

export default function AdminLayout() {
  const { pathname } = useLocation()
  const isLogin = pathname === '/admin/login'

  if (isLogin) {
    return <Outlet />
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto bg-card/30">
        <Outlet />
      </main>
    </div>
  )
}
