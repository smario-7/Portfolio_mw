import type { ContactMessage, ContactMessageInsert } from '@/lib/types/contact-message'
import { apiRequest } from '@/lib/api/client'
import { supabase } from '@/lib/supabase/client'
import * as contactMessageRepository from '@/lib/supabase/repositories/contact-message.repository'

export async function submitContactMessage(
  data: ContactMessageInsert
): Promise<ContactMessage> {
  if (supabase != null) {
    return contactMessageRepository.insertContactMessage(data)
  }
  return apiRequest<ContactMessage>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
