import type { AdminSettings, AdminSettingsInsert } from '@/lib/types/admin-settings'
import { supabase } from '@/lib/supabase/client'
import * as adminSettingsRepository from '@/lib/supabase/repositories/admin-settings.repository'

export async function getAdminSettings(): Promise<AdminSettings | null> {
  if (supabase == null) return null
  return adminSettingsRepository.getAdminSettings()
}

export async function saveAdminSettings(
  data: AdminSettingsInsert
): Promise<AdminSettings> {
  if (supabase == null) {
    throw new Error('Supabase nie jest skonfigurowany')
  }
  return adminSettingsRepository.upsertAdminSettings(data)
}
