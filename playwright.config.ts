import { existsSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

const authStatePath = 'e2e/.auth/user.json'

export default defineConfig({
  testDir: 'e2e',
  testIgnore: /save-auth-state\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    ...(existsSync(authStatePath) && { storageState: authStatePath }),
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
