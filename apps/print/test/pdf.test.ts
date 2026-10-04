import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { extractText, getDocumentProxy } from 'unpdf'
import { beforeAll, describe, expect, it } from 'vitest'
import { resolveCvPhone } from '../cv-phone'
import { PHONE, FORBIDDEN_IN_RESUME } from '../../../tools/repo-guard/patterns'

const pdfPath = fileURLToPath(
  new URL('../../../out/cv-nikolay-belibov.pdf', import.meta.url)
)

let text = ''
let totalPages = 0

beforeAll(async () => {
  const buffer = await readFile(pdfPath)
  const document = await getDocumentProxy(new Uint8Array(buffer))
  const extracted = await extractText(document, { mergePages: true })
  text = extracted.text
  totalPages = extracted.totalPages
})

describe('the PDF is ATS-readable', () => {
  it('carries a text layer rather than an image', () => {
    expect(text.length).toBeGreaterThan(1500)
  })

  it('fits on two pages', () => {
    expect(totalPages).toBeLessThanOrEqual(2)
  })

  it.each([
    'Nikolay Belibov',
    'Frontend Engineer',
    'belibov.nikolay@gmail.com',
    '@Belkins18',
    'WireX Systems',
    'React',
    'TypeScript',
    'Vite',
    'TanStack Query',
    'Playwright',
    'Tailwind CSS'
  ])('contains the keyword: %s', (keyword) => {
    expect(text).toContain(keyword)
  })

  it('substituted the years of experience and left no raw tokens', () => {
    expect(text).toContain('11 years')
    expect(text).not.toContain('{{')
  })

  it.each(FORBIDDEN_IN_RESUME)(
    'does not contain the forbidden wording: %s',
    (_label, pattern) => {
      expect(text).not.toMatch(pattern)
    }
  )

  it('carries a phone number exactly when CV_PHONE is set', () => {
    // The value comes from the same resolver the build uses: if the check read
    // a source of its own, a drift between the two would slip past the test again.
    const expected = resolveCvPhone()
    if (expected === '') {
      expect(text).not.toMatch(PHONE)
    } else {
      expect(text).toContain(expected)
    }
  })
})
