import { expect, test } from '@playwright/test'

/*
 * The button in the rail is a link to a static file, and a static link breaks in
 * silence: the markup stays where it was, the attribute stays where it was, and
 * a click brings back a 404 page. So what is checked is not that the link exists
 * but that a real PDF sits at its address.
 */
test('the Download PDF button serves a real PDF', async ({ page, request }) => {
  await page.goto('/')

  const link = page.getByRole('link', { name: /download pdf/i })
  await expect(link).toHaveAttribute('href', '/cv-nikolay-belibov.pdf')
  // Without download the browser would open the file in a tab, while the button
  // promises a download.
  await expect(link).toHaveAttribute('download', '')

  const response = await request.get('/cv-nikolay-belibov.pdf')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('pdf')

  const body = await response.body()
  // The signature, not the size: a 404 page also weighs more than zero.
  expect(body.subarray(0, 5).toString('utf8')).toBe('%PDF-')
})
