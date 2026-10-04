import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const isCi = process.env['CI'] !== undefined

/**
 * e2e runs against the built site, not against the dev server: what is checked
 * is exactly what ships — the real router, the real locale-chunk fetch, the real
 * minification. Hence webServer is `vite preview`, and a fresh
 * `pnpm --filter @cv/web build` before the run is mandatory.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  // An explicit reporter instead of the default: the html reporter starts a
  // server and waits for a human, while a run in CI or on a branch has to finish
  // on its own.
  reporter: 'list',
  use: { baseURL: `http://localhost:${PORT}`, trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
  webServer: {
    // strictPort: a preview that silently moved to the next port would report
    // "the server did not respond" instead of the honest "port already in use".
    command: `pnpm run preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCi
  }
})
