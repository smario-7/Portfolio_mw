-- Tabela contact_messages do przechowywania wiadomości kontaktowych z formularza
-- Anon może tylko INSERT (nie może czytać ani modyfikować), authenticated może czytać i aktualizować

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now() not null,
  processed boolean default false not null,
  processed_at timestamptz,
  
  -- Walidacja na poziomie bazy danych
  constraint check_name_length check (char_length(name) between 2 and 100),
  constraint check_email_format check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  constraint check_message_length check (char_length(message) between 10 and 2000)
);

-- Indeks dla szybkiego wyszukiwania nieprzetworzonych wiadomości (używany przez n8n)
create index if not exists idx_contact_messages_processed 
  on public.contact_messages(processed, created_at);

-- Włączamy Row Level Security
alter table public.contact_messages enable row level security;

-- Polityka: anon może tylko INSERT (nie może czytać ani modyfikować)
create policy "anon_can_insert_contact_messages"
  on public.contact_messages
  for insert
  to anon
  with check (true);

-- Polityka: authenticated może czytać wszystkie wiadomości (dla panelu admina)
create policy "authenticated_can_read_contact_messages"
  on public.contact_messages
  for select
  to authenticated
  using (true);

-- Polityka: authenticated może aktualizować (dla oznaczenia jako przetworzone)
create policy "authenticated_can_update_contact_messages"
  on public.contact_messages
  for update
  to authenticated
  using (true)
  with check (true);
