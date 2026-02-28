import type { AdminSettings, AdminSettingsInsert } from '@/lib/types'
import {
  getAdminSettings as getAdminSettingsApi,
  saveAdminSettings as saveAdminSettingsApi,
} from '@/lib/api/admin-settings-api'

export async function getAdminSettings(): Promise<AdminSettings | null> {
  return getAdminSettingsApi()
}

export async function saveAdminSettings(data: AdminSettingsInsert): Promise<AdminSettings> {
  return saveAdminSettingsApi(data)
}
