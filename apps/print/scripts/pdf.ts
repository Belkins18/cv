import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { preview } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const outDir = fileURLToPath(new URL('../../../out/', import.meta.url))

await mkdir(outDir, { recursive: true })

// Статическая страница поднимается через preview, а не открывается по file:// —
// модульные скрипты по file:// блокируются политикой CORS.
const server = await preview({
  root,
  preview: { port: 4327, strictPort: true }
})
const url = server.resolvedUrls?.local[0]
if (url === undefined) throw new Error('preview-сервер не отдал адрес')

const browser = await chromium.launch()
try {
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.emulateMedia({ media: 'print' })
  await page.pdf({
    path: `${outDir}cv-nikolay-belibov.pdf`,
    printBackground: true,
    preferCSSPageSize: true
  })
  console.log(`написано ${outDir}cv-nikolay-belibov.pdf`)
} finally {
  await browser.close()
  await server.close()
}
