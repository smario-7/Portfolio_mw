import type { ContentData } from '@/lib/types/content'
import { supabase } from '@/lib/supabase/client'
import {
  APP_DATA_CONTENT_KEY,
  contentValueToContentData,
} from '@/lib/supabase/types'

function getClient() {
  if (!supabase) {
    throw new Error(
      'Skonfiguruj Supabase (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)'
    )
  }
  return supabase
}

export async function getContent(): Promise<ContentData> {
  const client = getClient()
  const { data, error } = await client
    .from('app_data')
    .select('value')
    .eq('key', APP_DATA_CONTENT_KEY)
    .single()
  if (error) throw new Error(error.message)
  return contentValueToContentData(data.value)
}

export async function getContentUpdatedAt(): Promise<string | null> {
  const client = getClient()
  const { data, error } = await client
    .from('app_data')
    .select('updated_at')
    .eq('key', APP_DATA_CONTENT_KEY)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data?.updated_at ?? null
}

export async function saveContent(data: ContentData): Promise<void> {
  const client = getClient()
  const { error } = await client
    .from('app_data')
    .upsert(
      {
        key: APP_DATA_CONTENT_KEY,
        value: data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )
  if (error) throw new Error(error.message)
}
