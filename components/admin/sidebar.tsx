'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, User, ImageIcon, Settings, LogOut, BookOpen } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  
  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projekty', icon: FileText },
    { href: '/admin/content', label: 'Edycja treści', icon: BookOpen },
    { href: '/admin/media', label: 'Media', icon: ImageIcon },
    { href: '/admin/settings', label: 'Ustawienia', icon: Settings },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm p-6 sticky top-0 h-screen overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Portfolio</h1>
        <p className="text-xs text-muted-foreground">Panel administracyjny</p>
      </div>

      <nav className="space-y-2 mb-12">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
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

      <div className="border-t border-border pt-6">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground">
          <LogOut className="h-5 w-5" />
          Wyloguj się
        </button>
      </div>
    </aside>
  )
}
