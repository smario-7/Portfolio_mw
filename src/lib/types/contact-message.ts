export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  processed: boolean
  processed_at: string | null
}

export interface ContactMessageInsert {
  name: string
  email: string
  message: string
}

export interface ContactMessageUpdate {
  processed?: boolean
  processed_at?: string | null
}
