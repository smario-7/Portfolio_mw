import type { ContactMessage, ContactMessageInsert } from '@/lib/types'
import { submitContactMessage } from '@/lib/api/contact-api'

export async function submitMessage(data: ContactMessageInsert): Promise<ContactMessage> {
  return submitContactMessage(data)
}
