import { expect, test } from '@playwright/test'

/*
 * Ссылка на этот сайт уходит в письмо, в LinkedIn и в мессенджер рекрутёру —
 * то есть карточку превью увидят раньше самого сайта. Теги в index.html
 * не проверяет ни один тип и ни одна сборка: удалить их можно молча.
 */
test('ссылка разворачивается не пустой карточкой', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Nikolay Belibov — Frontend Engineer')

  const content = (selector: string): Promise<string | null> =>
    page.locator(selector).getAttribute('content')

  await expect(await content('meta[name="description"]')).toMatch(
    /frontend engineer/i
  )
  await expect(await content('meta[property="og:title"]')).toBe(
    'Nikolay Belibov — Frontend Engineer'
  )
  await expect(await content('meta[property="og:description"]')).toMatch(
    /TypeScript/
  )
  await expect(await content('meta[property="og:type"]')).toBe('profile')
})

test('фавиконка существует и это SVG, а не HTML под видом иконки', async ({
  page,
  request
}) => {
  await page.goto('/')

  const href = await page.locator('link[rel="icon"]').getAttribute('href')
  expect(href).toBe('/favicon.svg')

  const response = await request.get('/favicon.svg')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('image/svg+xml')
  expect(await response.text()).toContain('<svg')
})

/*
 * Описание — публичный текст, и на него распространяются те же границы,
 * что и на датасет. Гвард сюда дотягивается (index.html отслеживается),
 * но проверить стоит и то, что уехало в сборку.
 */
test('описание не выходит за границы, принятые для текста резюме', async ({
  page
}) => {
  await page.goto('/')
  const head = await page.locator('head').innerHTML()
  expect(head).not.toMatch(/\bSenior\b/i)
  expect(head).not.toMatch(new RegExp(['cyber', 'security'].join(' ?'), 'i'))
})
