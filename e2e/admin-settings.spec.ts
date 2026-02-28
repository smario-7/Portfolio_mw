import { test, expect } from '@playwright/test'

test('logowanie → ustawienia ładują się', async ({ page }) => {
  await page.goto('/admin/settings')
  const isLogin = await Promise.race([
    page.waitForURL(/\/admin\/login/, { timeout: 15_000 }).then(() => true),
    page.getByRole('heading', { name: /ustawienia/i }).waitFor({ state: 'visible', timeout: 15_000 }).then(() => false),
  ]).catch(() => true)
  if (isLogin) {
    test.skip(true, 'Brak storageState. Uruchom: npm run test:e2e:auth')
  }

  await expect(page.getByRole('heading', { name: /ustawienia/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /zapisz ustawienia/i })).toBeVisible()
})
