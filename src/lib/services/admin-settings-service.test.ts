import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getAdminSettings, saveAdminSettings } from '@/lib/services/admin-settings-service'
import * as adminSettingsApi from '@/lib/api/admin-settings-api'

vi.mock('@/lib/api/admin-settings-api', () => ({
  getAdminSettings: vi.fn(),
  saveAdminSettings: vi.fn(),
}))

describe('admin-settings-service', () => {
  beforeEach(() => {
    vi.mocked(adminSettingsApi.getAdminSettings).mockReset()
    vi.mocked(adminSettingsApi.saveAdminSettings).mockReset()
  })

  describe('getAdminSettings', () => {
    it('returns data from API', async () => {
      const settings = {
        id: '1',
        user_id: 'user-1',
        email: 'admin@example.com',
        name: 'Admin',
        created_at: '',
        updated_at: '',
      }
      vi.mocked(adminSettingsApi.getAdminSettings).mockResolvedValue(settings)
      const result = await getAdminSettings()
      expect(adminSettingsApi.getAdminSettings).toHaveBeenCalledTimes(1)
      expect(result).toEqual(settings)
    })

    it('returns null when API returns null', async () => {
      vi.mocked(adminSettingsApi.getAdminSettings).mockResolvedValue(null)
      const result = await getAdminSettings()
      expect(result).toBeNull()
    })
  })

  describe('saveAdminSettings', () => {
    it('calls API with insert data and returns saved settings', async () => {
      const insert = { email: 'new@example.com', name: 'New Admin' }
      const saved = {
        id: '1',
        user_id: 'user-1',
        email: insert.email,
        name: insert.name,
        created_at: '',
        updated_at: '',
      }
      vi.mocked(adminSettingsApi.saveAdminSettings).mockResolvedValue(saved)
      const result = await saveAdminSettings(insert)
      expect(adminSettingsApi.saveAdminSettings).toHaveBeenCalledTimes(1)
      expect(adminSettingsApi.saveAdminSettings).toHaveBeenCalledWith(insert)
      expect(result).toEqual(saved)
    })
  })
})
