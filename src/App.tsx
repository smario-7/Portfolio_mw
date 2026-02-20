import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { ErrorBoundary } from '@/components/shared'
import { PortfolioProvider } from '@/contexts/PortfolioContext'
import AdminLayout from '@/layouts/AdminLayout'
import HomePage from '@/pages/HomePage'
import AdminLoginPage from '@/pages/AdminLoginPage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'
import AdminContentPage from '@/pages/AdminContentPage'
import AdminProjectsPage from '@/pages/AdminProjectsPage'
import AdminProjectEditPage from '@/pages/AdminProjectEditPage'
import AdminSettingsPage from '@/pages/AdminSettingsPage'

function App() {
  const basename = import.meta.env.DEV ? '/' : (import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, ''))
  
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" attribute="class" enableSystem>
        <BrowserRouter basename={basename}>
          <PortfolioProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/login" replace />} />
                <Route path="login" element={<AdminLoginPage />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="about" element={<Navigate to="/admin/content/about" replace />} />
                <Route path="content" element={<Navigate to="/admin/content/home" replace />} />
                <Route path="content/:section" element={<AdminContentPage />} />
                <Route path="projects" element={<AdminProjectsPage />} />
                <Route path="projects/new" element={<Navigate to="/admin/projects" replace />} />
                <Route path="projects/:id" element={<AdminProjectEditPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
            </Routes>
            <Toaster />
          </PortfolioProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
