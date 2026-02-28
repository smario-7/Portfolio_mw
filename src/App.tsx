import * as React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ADMIN_LOGIN, ADMIN_CONTENT_ABOUT, ADMIN_CONTENT_HOME, ADMIN_PROJECTS } from '@/lib/constants/routes'
import {
  getRouterBasename,
  REDIRECT_STORAGE_KEY,
  pathRelativeToBasename,
  isSafeInternalPath,
} from '@/lib/constants/app-url'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { ErrorBoundary, PageLoader } from '@/components/shared'
import { PortfolioProvider } from '@/contexts/PortfolioContext'
import HomePage from '@/pages/HomePage'

const AdminLayout = React.lazy(() => import('@/layouts/AdminLayout'))
const AdminLoginPage = React.lazy(() => import('@/pages/AdminLoginPage'))
const AdminDashboardPage = React.lazy(() => import('@/pages/AdminDashboardPage'))
const AdminContentPage = React.lazy(() => import('@/pages/AdminContentPage'))
const AdminProjectsPage = React.lazy(() => import('@/pages/AdminProjectsPage'))
const AdminProjectEditPage = React.lazy(() => import('@/pages/AdminProjectEditPage'))
const AdminSettingsPage = React.lazy(() => import('@/pages/AdminSettingsPage'))

function RedirectFromStorage({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  React.useEffect(() => {
    try {
      const raw = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(REDIRECT_STORAGE_KEY) : null
      if (!raw) return
      sessionStorage.removeItem(REDIRECT_STORAGE_KEY)
      const basename = getRouterBasename()
      const path = pathRelativeToBasename(raw.trim(), basename ?? undefined)
      const pathNorm = path.startsWith('/') ? path : `/${path}`
      if (!isSafeInternalPath(pathNorm)) return
      navigate(pathNorm, { replace: true })
    } catch (_err) {
      // sessionStorage niedostępny lub błąd – ignorujemy
    }
  }, [navigate])

  return <>{children}</>
}

function App() {
  const basename = getRouterBasename()

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" attribute="class" enableSystem>
        <BrowserRouter basename={basename}>
          <RedirectFromStorage>
          <PortfolioProvider>
            <React.Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to={ADMIN_LOGIN} replace />} />
                  <Route path="login" element={<AdminLoginPage />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="about" element={<Navigate to={ADMIN_CONTENT_ABOUT} replace />} />
                  <Route path="content" element={<Navigate to={ADMIN_CONTENT_HOME} replace />} />
                  <Route path="content/:section" element={<AdminContentPage />} />
                  <Route path="projects" element={<AdminProjectsPage />} />
                  <Route path="projects/new" element={<Navigate to={ADMIN_PROJECTS} replace />} />
                  <Route path="projects/:id" element={<AdminProjectEditPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>
              </Routes>
            </React.Suspense>
            <Toaster />
          </PortfolioProvider>
          </RedirectFromStorage>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
