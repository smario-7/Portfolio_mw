import { supabase } from '@/lib/supabase/client'
import type { ContactMessage, ContactMessageInsert } from '@/lib/types'

function getClient() {
  if (!supabase) {
    throw new Error(
      'Skonfiguruj Supabase (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)'
    )
  }
  return supabase
}

export async function insertContactMessage(
  data: ContactMessageInsert
): Promise<ContactMessage> {
  const client = getClient()
  const { data: result, error } = await client
    .from('contact_messages')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return result as ContactMessage
}

export async function getUnprocessedMessages(): Promise<ContactMessage[]> {
  const client = getClient()
  const { data, error } = await client
    .from('contact_messages')
    .select('*')
    .eq('processed', false)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as ContactMessage[]
}

export async function markAsProcessed(id: string): Promise<void> {
  const client = getClient()
  const { error } = await client
    .from('contact_messages')
    .update({
      processed: true,
      processed_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function getAllMessages(): Promise<ContactMessage[]> {
  const client = getClient()
  const { data, error } = await client
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as ContactMessage[]
}

// Usuwanie pojedynczej wiadomości. Zwraca błąd, jeśli RLS zablokował usunięcie (np. brak polityki DELETE).
// Wymaga: polityka RLS "authenticated_can_delete_contact_messages"
// (plik: scripts/supabase/06a-contact_messages_delete_policy.sql)
export async function deleteContactMessage(id: string): Promise<void> {
  const client = getClient()
  const { data, error } = await client
    .from('contact_messages')
    .delete()
    .eq('id', id)
    .select('id')
  if (error) throw new Error(error.message)
  if (!data || data.length === 0) {
    throw new Error(
      'Nie usunięto wiadomości. Sprawdź, czy w Supabase jest włączona polityka RLS dla DELETE (scripts/supabase/06a-contact_messages_delete_policy.sql) i czy jesteś zalogowany.'
    )
  }
}

// Zbiorcze usuwanie wiadomości. Rzuca błąd, jeśli nic nie usunięto (np. RLS blokuje).
export async function deleteContactMessages(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  const client = getClient()
  const { data, error } = await client
    .from('contact_messages')
    .delete()
    .in('id', ids)
    .select('id')
  if (error) throw new Error(error.message)
  if (!data || data.length === 0) {
    throw new Error(
      'Nie usunięto żadnej wiadomości. Sprawdź politykę RLS dla DELETE (scripts/supabase/06a-contact_messages_delete_policy.sql) i zalogowanie.'
    )
  }
}
