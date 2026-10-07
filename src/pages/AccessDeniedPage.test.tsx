import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AccessDeniedPage from './AccessDeniedPage'

const signInWithGoogle = vi.fn()
vi.mock('@/lib/supabase/auth', () => ({
  signInWithGoogle: (...args: unknown[]) => signInWithGoogle(...args),
  isAuthAvailable: () => true,
}))

describe('AccessDeniedPage', () => {
  it('pokazuje komunikat, link do strony głównej i loguje przez Google', () => {
    render(
      <MemoryRouter>
        <AccessDeniedPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/nie masz uprawnień do tej sekcji strony/)).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Powrót do strony głównej' }).getAttribute('href')).toBe('/')
    fireEvent.click(screen.getByRole('button', { name: /Zaloguj się przez Google/ }))
    expect(signInWithGoogle).toHaveBeenCalledTimes(1)
  })
})
