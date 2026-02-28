import type { ContactMessage } from '@/lib/types'
import {
  getContactMessages as getContactMessagesApi,
  deleteContactMessage as deleteContactMessageApi,
  deleteContactMessages as deleteContactMessagesApi,
} from '@/lib/api/contact-messages-api'

export async function getContactMessages(): Promise<ContactMessage[]> {
  return getContactMessagesApi()
}

export async function deleteContactMessage(id: string): Promise<void> {
  return deleteContactMessageApi(id)
}

export async function deleteContactMessages(ids: string[]): Promise<void> {
  return deleteContactMessagesApi(ids)
}
