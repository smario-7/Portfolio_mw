import type { Session } from '@supabase/supabase-js'
import { supabase } from './client'

export function isAuthAvailable(): boolean {
  return supabase !== null
}

export function signInWithGoogle(redirectTo?: string): void {
  if (!supabase) return
  const url =
    redirectTo ??
    `${window.location.origin}${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/admin/dashboard`
  updateSessionActivity()
  supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: url } })
}

export function signOut(): Promise<void> {
  if (!supabase) return Promise.resolve()
  clearSessionActivity()
  return supabase.auth.signOut().then(() => {})
}

export function getSession(): Promise<{ data: { session: Session | null } }> {
  if (!supabase) return Promise.resolve({ data: { session: null } })
  return supabase.auth.getSession()
}

export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
): () => void {
  if (!supabase) return () => {}
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      updateSessionActivity()
    }
    callback(event, session)
  })
  return () => subscription.unsubscribe()
}

export function isSessionValid(session: Session | null): boolean {
  if (!session) return false
  const expiresAt = session.expires_at
  if (!expiresAt) return true
  return expiresAt * 1000 > Date.now()
}

const SESSION_ACTIVITY_KEY = 'supabase_session_activity'
const SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000

export function updateSessionActivity(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(SESSION_ACTIVITY_KEY, Date.now().toString())
  } catch (err) {
    console.warn('Failed to update session activity:', err)
  }
}

export function getSessionActivityTime(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const activityTime = localStorage.getItem(SESSION_ACTIVITY_KEY)
    return activityTime ? parseInt(activityTime, 10) : null
  } catch (err) {
    console.warn('Failed to get session activity:', err)
    return null
  }
}

export function clearSessionActivity(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(SESSION_ACTIVITY_KEY)
  } catch (err) {
    console.warn('Failed to clear session activity:', err)
  }
}

export function isSessionTimedOut(): boolean {
  const activityTime = getSessionActivityTime()
  if (!activityTime) return false
  const timeSinceActivity = Date.now() - activityTime
  return timeSinceActivity >= SESSION_TIMEOUT_MS
}
