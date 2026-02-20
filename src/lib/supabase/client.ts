import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

try {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (typeof url === 'string' && url.length > 0 && typeof key === 'string' && key.length > 0) {
    supabaseInstance = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  }
} catch (err) {
  console.warn('Supabase client initialization failed:', err)
  supabaseInstance = null
}

export const supabase: SupabaseClient | null = supabaseInstance
