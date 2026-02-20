import { useEffect, useState, useCallback } from 'react'
import {
  getSession,
  onAuthStateChange,
  updateSessionActivity,
  isSessionTimedOut,
  signOut
} from '@/lib/supabase/auth'
import type { Session } from '@supabase/supabase-js'

export function useAdminSession() {
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

    // Co 60 s sprawdzamy timeout sesji przy braku aktywności.
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

  return { session, authLoading }
}
