'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Github, Menu, X } from 'lucide-react'

export function Navbar() {
  const [isDark, setIsDark] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-foreground">
              {'<MW />'}
            </div>
            <div className="h-10" />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-foreground">
            {'<MW />'}
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#home" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Strona główna
            </a>
            <a href="#projects" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Projekty
            </a>
            <a href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              O mnie
            </a>
            <a href="#contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Kontakt
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden md:flex"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden md:flex"
            >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="mt-4 flex flex-col gap-4 border-t border-border/40 pt-4 md:hidden">
            <a href="#home" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Strona główna
            </a>
            <a href="#projects" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Projekty
            </a>
            <a href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              O mnie
            </a>
            <a href="#contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Kontakt
            </a>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
