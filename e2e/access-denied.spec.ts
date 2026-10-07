import { test, expect } from '@playwright/test'

test('nieznana ścieżka pokazuje brak uprawnień i link do strony głównej', async ({ page }) => {
  await page.goto('/foo')
  await expect(page.getByText(/nie masz uprawnień do tej sekcji strony/i)).toBeVisible()
  await page.getByRole('link', { name: 'Powrót do strony głównej' }).click()
  await expect(page).toHaveURL(/\/$/)
})

test.describe('bez zapisanej sesji', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('admin przekierowuje na login', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL(/\/admin\/login/)
  })
})
