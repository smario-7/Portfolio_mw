import { existsSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

const authStatePath = 'e2e/.auth/user.json'

export default defineConfig({
  testDir: 'e2e',
  testMatch: /(save-auth-state|admin-project-preview|admin-content-edit|admin-dashboard|admin-settings)\.spec\.ts/,
  timeout: 120_000,
  use: {
    baseURL: 'http://localhost:5173',
    ...(existsSync(authStatePath) && { storageState: authStatePath }),
    ...devices['Desktop Chrome'],
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
