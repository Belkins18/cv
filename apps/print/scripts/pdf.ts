import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { preview } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const outDir = fileURLToPath(new URL('../../../out/', import.meta.url))

await mkdir(outDir, { recursive: true })

// The static page is served through preview rather than opened over file://:
// module scripts loaded from file:// are blocked by the CORS policy.
const server = await preview({
  root,
  preview: { port: 4327, strictPort: true }
})
const url = server.resolvedUrls?.local[0]
if (url === undefined) throw new Error('the preview server returned no address')

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
  console.log(`written ${outDir}cv-nikolay-belibov.pdf`)
} finally {
  await browser.close()
  await server.close()
}
