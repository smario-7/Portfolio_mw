import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Settings, LogOut, Home, User, Mail } from 'lucide-react'
import {
  ADMIN_DASHBOARD,
  ADMIN_CONTENT_HOME,
  ADMIN_PROJECTS,
  ADMIN_CONTENT_ABOUT,
  ADMIN_CONTENT_CONTACT,
  ADMIN_SETTINGS,
} from '@/lib/constants/routes'
import { ADMIN_SIDEBAR_WIDTH_CLASS } from '@/lib/constants/layout'

export function Sidebar() {
  const { pathname } = useLocation()

  const links = [
    { to: ADMIN_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { to: ADMIN_CONTENT_HOME, label: 'Home', icon: Home },
    { to: ADMIN_PROJECTS, label: 'Projekty', icon: FileText },
    { to: ADMIN_CONTENT_ABOUT, label: 'O mnie', icon: User },
    { to: ADMIN_CONTENT_CONTACT, label: 'Kontakt', icon: Mail },
    { to: ADMIN_SETTINGS, label: 'Ustawienia', icon: Settings },
  ]

  return (
    <aside className={`${ADMIN_SIDEBAR_WIDTH_CLASS} border-r-2 border-border bg-card/50 backdrop-blur-sm p-6 sticky top-0 h-screen overflow-y-auto`}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Portfolio</h1>
        <p className="text-xs text-muted-foreground">Panel administracyjny</p>
      </div>

      <nav className="space-y-2 mb-12">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.to

          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-card hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t-2 border-border pt-6">
        <Link
          to="/"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
        >
          <LogOut className="h-5 w-5" />
          Wyloguj się
        </Link>
      </div>
    </aside>
  )
}
