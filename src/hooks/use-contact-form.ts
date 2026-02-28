import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { submitMessage } from '@/lib/services/contact-service'
import { validateContactForm, type ContactFormErrors } from '@/lib/validation/contact-validation'
import type { ProfanityFieldResult } from '@/lib/validation/profanity-filter'

export interface UseContactFormReturn {
  name: string
  email: string
  message: string
  isSubmitting: boolean
  errors: ContactFormErrors
  submitSuccess: boolean
  rateLimitModalOpen: boolean
  setRateLimitModalOpen: (open: boolean) => void
  profanityDetected: boolean
  profanityModalOpen: boolean
  profanityFields: ProfanityFieldResult[]
  setProfanityModalOpen: (open: boolean) => void
  setName: (value: string) => void
  setEmail: (value: string) => void
  setMessage: (value: string) => void
  handleSubmit: () => Promise<void>
  resetForm: () => void
}

export function useContactForm(): UseContactFormReturn {
  const [name, setNameState] = useState('')
  const [email, setEmailState] = useState('')
  const [message, setMessageState] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [rateLimitModalOpen, setRateLimitModalOpen] = useState(false)
  const [profanityDetected, setProfanityDetected] = useState(false)
  const [profanityModalOpen, setProfanityModalOpen] = useState(false)
  const [profanityFields, setProfanityFields] = useState<ProfanityFieldResult[]>([])

  const setName = useCallback((value: string) => {
    setNameState(value)
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }))
    }
    if (errors.profanity && profanityDetected) {
      setProfanityDetected(false)
      setProfanityFields([])
      setErrors((prev) => ({ ...prev, profanity: undefined, profanityFields: undefined }))
    }
  }, [errors.name, errors.profanity, profanityDetected])

  const setEmail = useCallback((value: string) => {
    setEmailState(value)
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }))
    }
    if (errors.profanity && profanityDetected) {
      setProfanityDetected(false)
      setProfanityFields([])
      setErrors((prev) => ({ ...prev, profanity: undefined, profanityFields: undefined }))
    }
  }, [errors.email, errors.profanity, profanityDetected])

  const setMessage = useCallback((value: string) => {
    setMessageState(value)
    if (errors.message) {
      setErrors((prev) => ({ ...prev, message: undefined }))
    }
    if (errors.profanity && profanityDetected) {
      setProfanityDetected(false)
      setProfanityFields([])
      setErrors((prev) => ({ ...prev, profanity: undefined, profanityFields: undefined }))
    }
  }, [errors.message, errors.profanity, profanityDetected])

  const handleSubmit = useCallback(async () => {
    const validation = validateContactForm(name, email, message)

    if (!validation.valid) {
      setErrors(validation.errors)

      if (validation.errors.profanity) {
        setProfanityDetected(true)
        setProfanityFields(validation.errors.profanityFields ?? [])
        setProfanityModalOpen(true)
      }

      return
    }

    setIsSubmitting(true)
    setErrors({})
    setSubmitSuccess(false)
    setProfanityDetected(false)
    setProfanityFields([])

    try {
      await submitMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      })
      
      setSubmitSuccess(true)
      toast.success('Wiadomość została wysłana!')
      
      setNameState('')
      setEmailState('')
      setMessageState('')
      
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : 'Nie udało się wysłać wiadomości'
      const isRateLimit = /30\s*minut/.test(rawMessage)
      if (isRateLimit) {
        setRateLimitModalOpen(true)
      } else {
        toast.error(rawMessage)
        setErrors({ message: rawMessage })
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [name, email, message])

  const resetForm = useCallback(() => {
    setNameState('')
    setEmailState('')
    setMessageState('')
    setErrors({})
    setSubmitSuccess(false)
    setProfanityDetected(false)
    setProfanityFields([])
    setProfanityModalOpen(false)
  }, [])

  return {
    name,
    email,
    message,
    isSubmitting,
    errors,
    submitSuccess,
    rateLimitModalOpen,
    setRateLimitModalOpen,
    profanityDetected,
    profanityModalOpen,
    profanityFields,
    setProfanityModalOpen,
    setName,
    setEmail,
    setMessage,
    handleSubmit,
    resetForm,
  }
}
