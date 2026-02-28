import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContactForm } from '@/hooks/use-contact-form'
import { submitMessage } from '@/lib/services/contact-service'
import { findProfanityInFields } from '@/lib/validation/profanity-filter'
import * as sonner from 'sonner'

vi.mock('@/lib/services/contact-service', () => ({
  submitMessage: vi.fn(),
}))

vi.mock('@/lib/validation/profanity-filter', () => ({
  findProfanityInFields: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const validName = 'Jan'
const validEmail = 'jan@example.com'
const validMessage = 'Wiadomość ma co najmniej dziesięć znaków.'

function setValidFields(
  result: ReturnType<typeof renderHook<ReturnType<typeof useContactForm>, unknown>>['result']
) {
  act(() => {
    result.current.setName(validName)
    result.current.setEmail(validEmail)
    result.current.setMessage(validMessage)
  })
}

describe('useContactForm', () => {
  beforeEach(() => {
    vi.mocked(findProfanityInFields).mockReturnValue([])
    vi.mocked(submitMessage).mockReset()
    vi.mocked(sonner.toast.success).mockClear()
    vi.mocked(sonner.toast.error).mockClear()
  })

  describe('validation blocks submit', () => {
    it('does not call API when name is empty and sets errors', async () => {
      const { result } = renderHook(() => useContactForm())
      act(() => {
        result.current.setEmail(validEmail)
        result.current.setMessage(validMessage)
      })

      await act(async () => {
        await result.current.handleSubmit()
      })

      expect(submitMessage).not.toHaveBeenCalled()
      expect(result.current.errors.name).toBe('Imię jest wymagane')
    })

    it('does not call API when email is invalid and sets errors', async () => {
      const { result } = renderHook(() => useContactForm())
      act(() => {
        result.current.setName(validName)
        result.current.setEmail('invalid')
        result.current.setMessage(validMessage)
      })

      await act(async () => {
        await result.current.handleSubmit()
      })

      expect(submitMessage).not.toHaveBeenCalled()
      expect(result.current.errors.email).toBe('Podaj poprawny adres email')
    })
  })

  describe('valid data – success', () => {
    it('calls API with trimmed data, clears fields, sets submitSuccess and shows toast', async () => {
      vi.mocked(submitMessage).mockResolvedValue({
        id: '1',
        name: validName,
        email: validEmail,
        message: validMessage,
        created_at: '',
        processed: false,
        processed_at: null,
      })
      const { result } = renderHook(() => useContactForm())
      setValidFields(result)

      await act(async () => {
        await result.current.handleSubmit()
      })

      expect(submitMessage).toHaveBeenCalledTimes(1)
      expect(submitMessage).toHaveBeenCalledWith({
        name: validName,
        email: validEmail,
        message: validMessage,
      })
      expect(result.current.submitSuccess).toBe(true)
      expect(result.current.name).toBe('')
      expect(result.current.email).toBe('')
      expect(result.current.message).toBe('')
      expect(sonner.toast.success).toHaveBeenCalledWith('Wiadomość została wysłana!')
    })
  })

  describe('rate-limit error', () => {
    it('sets rateLimitModalOpen when API rejects with message containing "30 minut"', async () => {
      vi.mocked(submitMessage).mockRejectedValue(
        new Error('Spróbuj ponownie za 30 minut')
      )
      const { result } = renderHook(() => useContactForm())
      setValidFields(result)

      await act(async () => {
        await result.current.handleSubmit()
      })

      expect(result.current.rateLimitModalOpen).toBe(true)
      expect(sonner.toast.error).not.toHaveBeenCalled()
    })
  })

  describe('other API error', () => {
    it('calls toast.error and sets errors.message when API rejects with other error', async () => {
      const errorMessage = 'Serwer niedostępny'
      vi.mocked(submitMessage).mockRejectedValue(new Error(errorMessage))
      const { result } = renderHook(() => useContactForm())
      setValidFields(result)

      await act(async () => {
        await result.current.handleSubmit()
      })

      expect(sonner.toast.error).toHaveBeenCalledWith(errorMessage)
      expect(result.current.errors.message).toBe(errorMessage)
    })
  })
})
