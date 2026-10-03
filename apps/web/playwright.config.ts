import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const isCi = process.env['CI'] !== undefined

/**
 * e2e гоняются по собранному сайту, а не по dev-серверу: проверяется ровно то,
 * что уедет на хостинг — настоящий роутер, настоящая подгрузка чанка локали,
 * настоящий minify. Поэтому webServer — `vite preview`, и свежий
 * `pnpm --filter @cv/web build` перед прогоном обязателен.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  // Явный репортер вместо дефолта: html-репортер поднимает сервер и ждёт
  // человека, а прогон в CI и в ветке обязан завершаться сам.
  reporter: 'list',
  use: { baseURL: `http://localhost:${PORT}`, trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
  webServer: {
    // strictPort: preview, уехавший на соседний порт, дал бы «сервер не ответил»
    // вместо честной ошибки «порт занят».
    command: `pnpm run preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCi
  }
})
