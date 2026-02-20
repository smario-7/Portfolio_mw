import type { ContactMessage } from '@/lib/types'
import { supabase } from '@/lib/supabase/client'
import * as contactMessageRepository from '@/lib/supabase/repositories/contact-message.repository'

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (supabase == null) return []
  return contactMessageRepository.getAllMessages()
}

export async function deleteContactMessage(id: string): Promise<void> {
  if (supabase == null) {
    throw new Error('Supabase nie jest skonfigurowany. Nie można usunąć wiadomości.')
  }
  await contactMessageRepository.deleteContactMessage(id)
}

export async function deleteContactMessages(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  if (supabase == null) {
    throw new Error('Supabase nie jest skonfigurowany. Nie można usunąć wiadomości.')
  }
  await contactMessageRepository.deleteContactMessages(ids)
}
