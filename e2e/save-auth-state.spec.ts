import { mkdirSync } from 'node:fs'
import { test } from '@playwright/test'

const authStatePath = 'e2e/.auth/user.json'

test('save auth state after manual Google login', async ({ page }) => {
  await page.goto('/admin/login')
  await page.waitForURL(/\/admin\/dashboard/, { timeout: 120_000 })
  mkdirSync('e2e/.auth', { recursive: true })
  await page.context().storageState({ path: authStatePath })
})
