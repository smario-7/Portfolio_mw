import { describe, it, expect } from 'vitest'
import type { Session } from '@supabase/supabase-js'
import { isAdminSession, isSignupDeniedError } from './auth'

const sessionWith = (user: Record<string, unknown>) => ({ user } as unknown as Session)

describe('isAdminSession', () => {
  it('akceptuje flagę is_admin w app_metadata', () => {
    expect(isAdminSession(sessionWith({ app_metadata: { is_admin: true } }))).toBe(true)
  })

  it('odrzuca brak flagi, false i brak sesji', () => {
    expect(isAdminSession(sessionWith({ app_metadata: {} }))).toBe(false)
    expect(isAdminSession(sessionWith({ app_metadata: { is_admin: false } }))).toBe(false)
    expect(isAdminSession(null)).toBe(false)
  })

  it('ignoruje is_admin w user_metadata (użytkownik może je sam ustawić)', () => {
    expect(isAdminSession(sessionWith({ app_metadata: {}, user_metadata: { is_admin: true } }))).toBe(false)
  })
})

describe('isSignupDeniedError', () => {
  it('rozpoznaje signup_disabled w query i w hashu', () => {
    expect(isSignupDeniedError('?error=access_denied&error_code=signup_disabled', '')).toBe(true)
    expect(isSignupDeniedError('', '#error=access_denied&error_code=signup_disabled')).toBe(true)
  })

  it('ignoruje brak błędu i inne kody', () => {
    expect(isSignupDeniedError('', '')).toBe(false)
    expect(isSignupDeniedError('?error=access_denied', '')).toBe(false)
    expect(isSignupDeniedError('?error_code=other', '#access_token=abc')).toBe(false)
  })
})
