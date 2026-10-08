import { defineConfig } from '@playwright/test';

const PORT = 4399;
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    launchOptions: { executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium', args: ['--no-sandbox'] },
  },
  webServer: {
    command: `npx astro preview --port ${PORT} --host 127.0.0.1`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
