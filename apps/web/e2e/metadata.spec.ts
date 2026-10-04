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

/*
 * og:url and the canonical link were held back until the site had a real
 * address, because a wrong one is worse than none: platforms prefer it over the
 * address the visitor actually came from. Now that the address exists, the two
 * have to agree — a canonical pointing one way and an og:url another splits the
 * same page across two records, and the link that gets shared is the loser.
 */
test('the published address is declared once, and the same in both places', async ({
  page
}) => {
  const site = 'https://nikolay-belibov-cv.netlify.app/'

  await page.goto('/')

  const ogUrl = await page
    .locator('meta[property="og:url"]')
    .getAttribute('content')
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute('href')

  expect(ogUrl).toBe(site)
  expect(canonical).toBe(site)
})
