import { describe, expect, it, vi, beforeEach } from 'vitest'
import { submitMessage } from '@/lib/services/contact-service'
import * as contactApi from '@/lib/api/contact-api'

vi.mock('@/lib/api/contact-api', () => ({
  submitContactMessage: vi.fn(),
}))

describe('contact-service', () => {
  describe('submitMessage', () => {
    beforeEach(() => {
      vi.mocked(contactApi.submitContactMessage).mockReset()
    })

    it('calls contact-api submitContactMessage with the same data and returns its result', async () => {
      const data = { name: 'Jan', email: 'jan@example.com', message: 'Hello' }
      const apiResult = {
        id: '1',
        name: data.name,
        email: data.email,
        message: data.message,
        created_at: '',
        processed: false,
        processed_at: null,
      }
      vi.mocked(contactApi.submitContactMessage).mockResolvedValue(apiResult)

      const result = await submitMessage(data)

      expect(contactApi.submitContactMessage).toHaveBeenCalledTimes(1)
      expect(contactApi.submitContactMessage).toHaveBeenCalledWith(data)
      expect(result).toBe(apiResult)
    })
  })
})
