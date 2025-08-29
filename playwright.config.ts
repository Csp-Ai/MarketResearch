import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    timeout: 120000,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
  testDir: './tests/e2e',
});
