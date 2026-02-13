import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, ImageIcon, Settings, LogOut, Home, User, Mail } from 'lucide-react'

export function Sidebar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/projects', label: 'Projekty', icon: FileText },
    { to: '/admin/content/home', label: 'Home', icon: Home },
    { to: '/admin/content/about', label: 'O mnie', icon: User },
    { to: '/admin/content/contact', label: 'Kontakt', icon: Mail },
    { to: '/admin/media', label: 'Media', icon: ImageIcon },
    { to: '/admin/settings', label: 'Ustawienia', icon: Settings },
  ]

  return (
    <aside className="w-64 border-r-2 border-border bg-card/50 backdrop-blur-sm p-6 sticky top-0 h-screen overflow-y-auto">
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
