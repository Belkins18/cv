import { expect, test } from '@playwright/test'

/**
 * The Ukrainian locale chunk. Vite turns `import('../locales/uk.json')` into
 * `assets/uk-<hash>.js` rather than a `.json`: the JSON is inlined straight into
 * the module. The plan expected `**\/*uk*.json` — no such file exists in the
 * build, and the route would simply never have matched.
 */
const UK_CHUNK = '**/assets/uk-*.js'

/**
 * A chip exposes its label and its count as the accessible name: "React 5". A
 * bare `/^React/` would also catch "React Hook Form", and Playwright's strict
 * mode would fail the test on two matches — hence the trailing digits.
 */
const chip = (label: string): RegExp =>
  new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\d+$`)

test('a link carrying a filter opens the CV already filtered', async ({
  page
}) => {
  await page.goto('/?tech=react,typescript,vite,tanstack-query')

  await expect(
    page.getByRole('checkbox', { name: chip('React') })
  ).toBeChecked()
  await expect(page.getByTestId('role-wirex')).toHaveAttribute(
    'data-dimmed',
    'false'
  )
  await expect(page.getByTestId('role-early-web')).toHaveAttribute(
    'data-dimmed',
    'true'
  )
})

/**
 * Review Focus #3 in a real browser. The unit tests already cover parseTechParam
 * and the `.catch` calls in searchSchema; here the same input goes through the
 * real router, a real chunk fetch and a real render — and must not produce a
 * single unhandled error on the page.
 */
test('junk in the search params does not break the page', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto('/?tech=react,drogon,,REACT&lang=fr&theme=midnight')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Nikolay Belibov'
  )
  await expect(
    page.getByRole('checkbox', { name: chip('React') })
  ).toBeChecked()
  // `drogon` is dropped, the empty item is dropped, `REACT` collapses into
  // `react`: exactly one chip stays checked.
  await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(1)
  // lang=fr and theme=midnight degraded to their defaults instead of bringing
  // the route down.
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  expect(errors).toEqual([])
})

test('picking a chip lands in the URL and survives a reload', async ({
  page
}) => {
  await page.goto('/')

  await page.getByRole('checkbox', { name: chip('Electron') }).click()
  await expect(page).toHaveURL(/tech=electron/)

  await page.reload()
  await expect(
    page.getByRole('checkbox', { name: chip('Electron') })
  ).toBeChecked()
})

test('switching the language changes the interface and fetches the Ukrainian chunk', async ({
  page
}) => {
  await page.goto('/')

  await page.getByRole('button', { name: /switch language/i }).click()

  await expect(page).toHaveURL(/lang=uk/)
  await expect(page.getByRole('heading', { name: 'Досвід' })).toBeVisible()
})

test('shows an error and a retry when the chunk fails to load', async ({
  page
}) => {
  await page.route(UK_CHUNK, (route) => route.abort())
  await page.goto('/?lang=uk')

  await expect(page.getByRole('alert')).toBeVisible()
  await expect(
    page.getByRole('button', { name: /спробувати ще раз/i })
  ).toBeVisible()

  /*
   * What follows is something the plan did not anticipate. The browser caches a
   * FAILED dynamic import: the module-map entry becomes null forever, and a
   * repeated `import()` of the same URL fails without touching the network. That
   * is why the retry button reloads the page instead of re-requesting the chunk
   * (see HomePage).
   */
  await page.unroute(UK_CHUNK)
  await page.getByRole('button', { name: /спробувати ще раз/i }).click()

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Досвід' })).toBeVisible()
})

test('the / key focuses the filter and ? opens the help panel', async ({
  page
}) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  await page.keyboard.press('/')
  await expect(
    page.locator("#tech-filter [role='checkbox']").first()
  ).toBeFocused()

  await page.keyboard.press('?')
  await expect(
    page.getByRole('heading', { name: /keyboard shortcuts/i })
  ).toBeVisible()
})

/*
 * Local storage is an input just like the URL, and anyone edits it: devtools, an
 * extension, an older version of the site. While the value came through
 * unvalidated, `{"lang":"zz"}` sent the locale at a chunk that does not exist,
 * the page fell into its error state — and the retry button reloaded it and read
 * the very same value back. The site died permanently, curable only by hand.
 */
test('broken stored preferences do not brick the site', async ({ page }) => {
  await page.addInitScript(() =>
    window.localStorage.setItem(
      'cv.preferences',
      '{"lang":"zz","theme":"banana"}'
    )
  )

  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Nikolay Belibov'
  )
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  // And the theme button is still a button, not stuck on an undefined mode.
  await page.getByRole('button', { name: /switch theme/i }).click()
  await expect(page).toHaveURL(/theme=(system|light|dark)/)
})
