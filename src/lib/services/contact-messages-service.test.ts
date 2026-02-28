import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  getContactMessages,
  deleteContactMessage,
  deleteContactMessages,
} from '@/lib/services/contact-messages-service'
import * as contactMessagesApi from '@/lib/api/contact-messages-api'

vi.mock('@/lib/api/contact-messages-api', () => ({
  getContactMessages: vi.fn(),
  deleteContactMessage: vi.fn(),
  deleteContactMessages: vi.fn(),
}))

describe('contact-messages-service', () => {
  beforeEach(() => {
    vi.mocked(contactMessagesApi.getContactMessages).mockReset()
    vi.mocked(contactMessagesApi.deleteContactMessage).mockReset()
    vi.mocked(contactMessagesApi.deleteContactMessages).mockReset()
  })

  describe('getContactMessages', () => {
    it('returns messages from API', async () => {
      const messages = [
        {
          id: '1',
          name: 'Jan',
          email: 'jan@example.com',
          message: 'Hello',
          created_at: '',
          processed: false,
          processed_at: null,
        },
      ]
      vi.mocked(contactMessagesApi.getContactMessages).mockResolvedValue(messages)
      const result = await getContactMessages()
      expect(contactMessagesApi.getContactMessages).toHaveBeenCalledTimes(1)
      expect(result).toEqual(messages)
    })
  })

  describe('deleteContactMessage', () => {
    it('calls API with message id', async () => {
      vi.mocked(contactMessagesApi.deleteContactMessage).mockResolvedValue(undefined)
      await deleteContactMessage('msg-123')
      expect(contactMessagesApi.deleteContactMessage).toHaveBeenCalledTimes(1)
      expect(contactMessagesApi.deleteContactMessage).toHaveBeenCalledWith('msg-123')
    })
  })

  describe('deleteContactMessages', () => {
    it('calls API with array of ids', async () => {
      vi.mocked(contactMessagesApi.deleteContactMessages).mockResolvedValue(undefined)
      await deleteContactMessages(['id-1', 'id-2'])
      expect(contactMessagesApi.deleteContactMessages).toHaveBeenCalledTimes(1)
      expect(contactMessagesApi.deleteContactMessages).toHaveBeenCalledWith(['id-1', 'id-2'])
    })
  })
})
