import { describe, it, expect } from 'vitest'
import type { Session } from '@supabase/supabase-js'
import { isAdminSession } from './auth'

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
