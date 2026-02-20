export interface AdminSettings {
  id: string
  user_id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface AdminSettingsInsert {
  email: string
  name: string
}

export interface AdminSettingsUpdate {
  email?: string
  name?: string
}
