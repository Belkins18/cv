import { expect, test } from '@playwright/test'

/*
 * Кнопка в рельсе — это ссылка на статический файл, а статическая ссылка
 * ломается молча: разметка остаётся на месте, атрибут остаётся на месте,
 * а по клику приезжает страница 404. Поэтому проверяется не наличие ссылки,
 * а то, что по её адресу лежит настоящий PDF.
 */
test('кнопка Download PDF отдаёт настоящий PDF', async ({ page, request }) => {
  await page.goto('/')

  const link = page.getByRole('link', { name: /download pdf/i })
  await expect(link).toHaveAttribute('href', '/cv-nikolay-belibov.pdf')
  // Без download браузер открыл бы файл вкладкой — кнопка обещает скачивание.
  await expect(link).toHaveAttribute('download', '')

  const response = await request.get('/cv-nikolay-belibov.pdf')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('pdf')

  const body = await response.body()
  // Сигнатура, а не размер: 404-страница тоже весит больше нуля.
  expect(body.subarray(0, 5).toString('utf8')).toBe('%PDF-')
})
