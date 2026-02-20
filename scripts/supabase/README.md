# Skrypty Supabase – Etap 1

Kolejność wykonania w dashboardzie Supabase:

1. **SQL Editor** – uruchom `01-app_data-rls.sql` (tabela i RLS).
2. **Storage** – New bucket: nazwa `project-files`, opcja **Public bucket** włączona → Create.
3. **SQL Editor** – uruchom `02-storage-policies.sql` (polityki dla bucketu).

Reszta Etapu 1 (Google OAuth, Auth → URL Configuration) – patrz [docs/plan-integracja-supabase.md](../../docs/plan-integracja-supabase.md).

Opcjonalnie: po utworzeniu tabeli możesz wstawić dane z repozytorium poleceniem z katalogu głównego projektu:
`node scripts/supabase/generate-seed.js`
Następnie wklej wygenerowany SQL do Supabase SQL Editor i uruchom.
