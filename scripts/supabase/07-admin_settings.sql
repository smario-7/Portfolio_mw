-- Tabela admin_settings do przechowywania ustawień właściciela (tylko dla zalogowanych użytkowników)
-- Wymaga: Supabase Auth włączony (tabela auth.users musi istnieć)

create table if not exists public.admin_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Jeden rekord ustawień na użytkownika
  unique(user_id),
  
  -- Walidacja
  constraint check_email_format check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  constraint check_name_length check (char_length(name) between 2 and 100)
);

-- Funkcja do automatycznej aktualizacji updated_at
create or replace function update_admin_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Trigger do automatycznej aktualizacji updated_at przy każdej zmianie
create trigger trigger_update_admin_settings_updated_at
  before update on public.admin_settings
  for each row
  execute function update_admin_settings_updated_at();

-- Włączamy Row Level Security
alter table public.admin_settings enable row level security;

-- Polityka: tylko authenticated może czytać swoje ustawienia
create policy "authenticated_can_read_own_settings"
  on public.admin_settings
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Polityka: tylko authenticated może tworzyć swoje ustawienia
create policy "authenticated_can_insert_own_settings"
  on public.admin_settings
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Polityka: tylko authenticated może aktualizować swoje ustawienia
create policy "authenticated_can_update_own_settings"
  on public.admin_settings
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
