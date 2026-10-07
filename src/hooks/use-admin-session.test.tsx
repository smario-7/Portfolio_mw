import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import type { Session } from '@supabase/supabase-js'

const signOut = vi.fn().mockResolvedValue(undefined)
let currentSession: Session | null = null

vi.mock('@/lib/supabase/auth', () => ({
  getSession: () => Promise.resolve({ data: { session: currentSession } }),
  onAuthStateChange: () => () => {},
  updateSessionActivity: () => {},
  isSessionTimedOut: () => false,
  isAdminSession: (s: Session | null) => s?.user.app_metadata?.is_admin === true,
  signOut: () => signOut(),
}))

import { useAdminSession } from './use-admin-session'

const sessionWith = (appMetadata: Record<string, unknown>) =>
  ({ user: { app_metadata: appMetadata } } as unknown as Session)

describe('useAdminSession', () => {
  beforeEach(() => signOut.mockClear())

  it('wpuszcza konto z is_admin', async () => {
    currentSession = sessionWith({ is_admin: true })
    const { result } = renderHook(() => useAdminSession())
    await waitFor(() => expect(result.current.authLoading).toBe(false))
    expect(result.current.session).toBe(currentSession)
    expect(result.current.accessDenied).toBe(false)
    expect(signOut).not.toHaveBeenCalled()
  })

  it('wylogowuje konto bez is_admin i ustawia accessDenied', async () => {
    currentSession = sessionWith({})
    const { result } = renderHook(() => useAdminSession())
    await waitFor(() => expect(result.current.accessDenied).toBe(true))
    expect(result.current.session).toBeNull()
    expect(signOut).toHaveBeenCalledTimes(1)
  })
})
