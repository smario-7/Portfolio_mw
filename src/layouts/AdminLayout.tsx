import { useEffect, useState, useCallback } from 'react'
import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { Sidebar } from '@/components/admin/sidebar'
import { ADMIN_MAIN_PADDING_CLASS } from '@/lib/constants/layout'
import {
  getSession,
  onAuthStateChange,
  updateSessionActivity,
  isSessionTimedOut,
  signOut
} from '@/lib/supabase/auth'
import type { Session } from '@supabase/supabase-js'

export default function AdminLayout() {
  const { pathname } = useLocation()
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const checkSessionTimeout = useCallback(async () => {
    if (isSessionTimedOut()) {
      await signOut()
      setSession(null)
      return true
    }
    return false
  }, [])

  useEffect(() => {
    getSession().then(async ({ data }) => {
      if (data.session) {
        updateSessionActivity()
        const timedOut = await checkSessionTimeout()
        if (!timedOut) {
          setSession(data.session)
        }
      } else {
        setSession(null)
      }
      setAuthLoading(false)
    })

    const unsubscribe = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        const { data } = await getSession()
        if (data.session) {
          updateSessionActivity()
          const timedOut = await checkSessionTimeout()
          if (!timedOut) {
            setSession(data.session)
          }
        } else {
          setSession(null)
        }
      } else {
        if (session) {
          updateSessionActivity()
        }
        setSession(session)
      }
    })

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    const handleActivity = () => {
      if (session) {
        updateSessionActivity()
      }
    }

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    const intervalId = setInterval(async () => {
      if (session) {
        const timedOut = await checkSessionTimeout()
        if (timedOut) {
          clearInterval(intervalId)
        }
      }
    }, 60000)

    return () => {
      unsubscribe()
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
      clearInterval(intervalId)
    }
  }, [session, checkSessionTimeout])

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
