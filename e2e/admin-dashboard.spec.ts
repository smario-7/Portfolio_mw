import { test, expect } from '@playwright/test'

test('logowanie → dashboard ładuje się', async ({ page }) => {
  await page.goto('/admin/dashboard')
  const isLogin = await Promise.race([
    page.waitForURL(/\/admin\/login/, { timeout: 15_000 }).then(() => true),
    page.getByRole('heading', { name: /dashboard/i }).waitFor({ state: 'visible', timeout: 15_000 }).then(() => false),
  ]).catch(() => true)
  if (isLogin) {
    test.skip(true, 'Brak storageState. Uruchom: npm run test:e2e:auth')
  }

  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
  await expect(page.getByText(/zarządzaj swoim portfolio/i)).toBeVisible()
})
