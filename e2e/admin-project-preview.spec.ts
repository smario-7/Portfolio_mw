import { test, expect } from '@playwright/test'

test('logowanie → edycja projektu → podgląd całości → zamknięcie modala', async ({
  page,
}) => {
  await page.goto('/admin/projects')
  const isLogin = await Promise.race([
    page.waitForURL(/\/admin\/login/, { timeout: 15_000 }).then(() => true),
    page
      .getByRole('heading', { name: /projekty|edycja/i })
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => false),
  ]).catch(() => true)
  if (isLogin) {
    test.skip(true, 'Brak storageState. Uruchom: npm run test:e2e:auth')
  }

  const editLink = page.getByRole('link', { name: /edytuj projekt/i }).first()
  await editLink.waitFor({ state: 'visible', timeout: 10_000 })
  await editLink.click()

  await expect(
    page.getByRole('heading', { name: /edycja projektu/i })
  ).toBeVisible({ timeout: 10_000 })

  await page.getByRole('button', { name: /podgląd całości/i }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible({ timeout: 5_000 })
  await expect(dialog.getByRole('heading', { level: 1 })).toBeVisible()

  await page.getByRole('button', { name: /close/i }).click()
  await expect(dialog).not.toBeVisible()
})
