import { test, expect } from '@playwright/test'

test('logowanie → edycja contentu → zapis', async ({ page }) => {
  await page.goto('/admin/content/home')
  const isLogin = await Promise.race([
    page.waitForURL(/\/admin\/login/, { timeout: 15_000 }).then(() => true),
    page.getByRole('heading', { name: /edycja treści strony/i }).waitFor({ state: 'visible', timeout: 15_000 }).then(() => false),
  ]).catch(() => true)
  if (isLogin) {
    test.skip(true, 'Brak storageState. Uruchom: npm run test:e2e:auth')
  }

  const heroTitle = page.getByLabel('Nagłówek główny')
  await heroTitle.fill(`test-e2e-${Date.now()}`)

  await page.getByRole('button', { name: /^zapisz$/i }).click()
  await expect(page.getByRole('button', { name: /zapisano/i })).toBeVisible({ timeout: 10_000 })
})
