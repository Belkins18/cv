import { expect, test } from '@playwright/test'

/*
 * A link to this site travels into an email, onto LinkedIn and into a message to
 * a recruiter — which means the preview card is seen before the site itself. The
 * tags in index.html are checked by no type and no build step: they can be
 * deleted in total silence.
 */
test('the link unfurls as something other than an empty card', async ({
  page
}) => {
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

test('the favicon exists and is real SVG, not HTML dressed up as an icon', async ({
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
 * The description is public text, so the same boundaries that apply to the
 * dataset apply to it. The guard does reach here (index.html is tracked), but
 * what ended up in the build is worth checking too.
 */
test('the description stays inside the boundaries set for the resume text', async ({
  page
}) => {
  await page.goto('/')
  const head = await page.locator('head').innerHTML()
  expect(head).not.toMatch(/\bSenior\b/i)
  expect(head).not.toMatch(new RegExp(['cyber', 'security'].join(' ?'), 'i'))
})
