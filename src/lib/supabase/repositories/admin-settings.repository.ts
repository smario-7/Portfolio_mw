import { supabase } from '@/lib/supabase/client'
import type { AdminSettings, AdminSettingsInsert } from '@/lib/types'

function getClient() {
  if (!supabase) {
    throw new Error(
      'Skonfiguruj Supabase (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)'
    )
  }
  return supabase
}

export async function getAdminSettings(): Promise<AdminSettings | null> {
  const client = getClient()
  const { data: { user } } = await client.auth.getUser()
  
  if (!user) {
    throw new Error('Użytkownik nie jest zalogowany')
  }

  const { data, error } = await client
    .from('admin_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data as AdminSettings | null
}

export async function upsertAdminSettings(
  data: AdminSettingsInsert
): Promise<AdminSettings> {
  const client = getClient()
  const { data: { user } } = await client.auth.getUser()
  
  if (!user) {
    throw new Error('Użytkownik nie jest zalogowany')
  }

  const { data: result, error } = await client
    .from('admin_settings')
    .upsert(
      {
        user_id: user.id,
        email: data.email,
        name: data.name,
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) throw new Error(error.message)
  return result as AdminSettings
}

export async function getAdminSettingsByUserId(
  userId: string
): Promise<AdminSettings | null> {
  const client = getClient()
  const { data, error } = await client
    .from('admin_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data as AdminSettings | null
}
