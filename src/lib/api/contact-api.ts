import type { ContactMessage, ContactMessageInsert } from '@/lib/types'
import { apiRequest } from '@/lib/api/client'
import { supabase } from '@/lib/supabase/client'

export async function submitContactMessage(
  data: ContactMessageInsert
): Promise<ContactMessage> {
  if (supabase != null) {
    const { data: resultData, error } = await supabase.functions.invoke(
      'submit-contact',
      { body: { name: data.name, email: data.email, message: data.message } }
    )
    if (error) {
      const message =
        (resultData as { error?: string } | null)?.error ?? error.message ?? 'Nie udało się wysłać wiadomości'
      throw new Error(message)
    }
    if (resultData == null) {
      throw new Error('Brak odpowiedzi z serwera.')
    }
    return resultData as ContactMessage
  }
  return apiRequest<ContactMessage>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
