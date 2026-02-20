import type { ContentData } from '@/lib/types'
import { supabase } from '@/lib/supabase/client'
import {
  APP_DATA_CONTENT_KEY,
  contentValueToContentData,
} from '@/lib/supabase/types'
import { DEFAULT_CONTENT } from '@/lib/data/content-defaults'

function getClient() {
  if (!supabase) {
    throw new Error(
      'Skonfiguruj Supabase (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)'
    )
  }
  return supabase
}

/** Uzupełnia brakujące sekcje (np. about) domyślną strukturą – np. gdy w bazie jest stary wpis bez sekcji "O mnie". */
function mergeWithDefaults(raw: Partial<ContentData>): ContentData {
  return {
    home: { ...DEFAULT_CONTENT.home, ...(raw.home ?? {}) },
    about: { ...DEFAULT_CONTENT.about, ...(raw.about ?? {}) },
    contact: { ...DEFAULT_CONTENT.contact, ...(raw.contact ?? {}) },
  }
}

export async function getContent(): Promise<ContentData> {
  const client = getClient()
  const { data, error } = await client
    .from('app_data')
    .select('value')
    .eq('key', APP_DATA_CONTENT_KEY)
    .single()
  if (error) throw new Error(error.message)
  const raw = contentValueToContentData(data.value)
  return mergeWithDefaults(raw)
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
