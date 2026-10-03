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

  it.each(FORBIDDEN_IN_RESUME)(
    'не содержит запрещённой формулировки: %s',
    (_label, pattern) => {
      expect(text).not.toMatch(pattern)
    }
  )

  it('телефон присутствует ровно тогда, когда задан CV_PHONE', () => {
    // Значение берётся тем же резолвером, что и сборка: если проверка будет
    // читать свой источник, рассинхрон снова пройдёт мимо теста.
    const expected = resolveCvPhone()
    if (expected === '') {
      expect(text).not.toMatch(PHONE)
    } else {
      expect(text).toContain(expected)
    }
  })
})
