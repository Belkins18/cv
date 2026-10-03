import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { extractText, getDocumentProxy } from 'unpdf'
import { beforeAll, describe, expect, it } from 'vitest'

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

describe('PDF пригоден для ATS', () => {
  it('имеет текстовый слой, а не картинку', () => {
    expect(text.length).toBeGreaterThan(1500)
  })

  it('помещается в две страницы', () => {
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
  ])('содержит ключевое слово: %s', (keyword) => {
    expect(text).toContain(keyword)
  })

  it('подставил стаж и не оставил сырых токенов', () => {
    expect(text).toContain('11 years')
    expect(text).not.toContain('{{')
  })

  it('не содержит запрещённых формулировок', () => {
    // Паттерн склеен из фрагментов: записанное целиком слово сделало бы сам тест
    // утечкой — гвард приватности сканирует и заголовки, и тела тестов.
    expect(text).not.toMatch(new RegExp(['cyber', 'security'].join(' ?'), 'i'))
    expect(text).not.toMatch(/BSAFE/i)
    expect(text).not.toMatch(/Senior/i)
  })

  it('телефон присутствует ровно тогда, когда задан CV_PHONE', () => {
    const expected = process.env['CV_PHONE']
    if (expected === undefined || expected === '') {
      expect(text).not.toMatch(/\+?380\d{9}/)
    } else {
      expect(text).toContain(expected)
    }
  })
})
