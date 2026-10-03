import { expect, test } from '@playwright/test'

/**
 * Чанк украинской локали. `import('../locales/uk.json')` Vite превращает не в
 * `.json`, а в `assets/uk-<hash>.js`: JSON инлайнится прямо в модуль. План ждал
 * `**\/*uk*.json` — такого файла в сборке не существует, и route молча не
 * срабатывал бы.
 */
const UK_CHUNK = '**/assets/uk-*.js'

/**
 * Чип отдаёт в доступное имя метку и счётчик: «React 5». Голое `/^React/`
 * поймало бы ещё и «React Hook Form», и строгий режим Playwright свалил бы тест
 * на двух совпадениях — отсюда цифра в хвосте.
 */
const chip = (label: string): RegExp =>
  new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\d+$`)

test('ссылка с фильтром открывает резюме уже отфильтрованным', async ({
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
 * Review Focus №3 в настоящем браузере. Юнит-тесты уже проверяют parseTechParam
 * и `.catch` в searchSchema; здесь то же самое проходит через реальный роутер,
 * реальную подгрузку чанка и реальный рендер — и не должно дать ни одной
 * необработанной ошибки на странице.
 */
test('мусор в параметрах не ломает страницу', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto('/?tech=react,drogon,,REACT&lang=fr&theme=midnight')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Nikolay Belibov'
  )
  await expect(
    page.getByRole('checkbox', { name: chip('React') })
  ).toBeChecked()
  // `drogon` выброшен, пустой элемент выброшен, `REACT` схлопнулся с `react`:
  // отмеченным остаётся ровно один чип.
  await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(1)
  // lang=fr и theme=midnight деградировали до значений по умолчанию, а не уронили маршрут.
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  expect(errors).toEqual([])
})

test('выбор чипа попадает в URL и переживает перезагрузку', async ({
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

test('переключение языка меняет интерфейс и грузит украинский чанк', async ({
  page
}) => {
  await page.goto('/')

  await page.getByRole('button', { name: /switch language/i }).click()

  await expect(page).toHaveURL(/lang=uk/)
  await expect(page.getByRole('heading', { name: 'Досвід' })).toBeVisible()
})

test('когда чанк не отдаётся, видно ошибку и повтор', async ({ page }) => {
  await page.route(UK_CHUNK, (route) => route.abort())
  await page.goto('/?lang=uk')

  await expect(page.getByRole('alert')).toBeVisible()
  await expect(
    page.getByRole('button', { name: /спробувати ще раз/i })
  ).toBeVisible()

  /*
   * Дальше — то, чего план не предполагал. Браузер кэширует ПРОВАЛИВШИЙСЯ
   * динамический импорт: запись в module map становится null навсегда, и
   * повторный `import()` того же URL падает, уже не ходя в сеть. Поэтому кнопка
   * повтора не перезапрашивает чанк, а перезагружает страницу (см. HomePage).
   */
  await page.unroute(UK_CHUNK)
  await page.getByRole('button', { name: /спробувати ще раз/i }).click()

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Досвід' })).toBeVisible()
})

test('клавиша / фокусирует фильтр, ? открывает справку', async ({ page }) => {
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
 * Хранилище — такой же вход, как URL, и правит его кто угодно: devtools,
 * расширение, прошлая версия сайта. Пока значение оттуда шло без проверки,
 * `{"lang":"zz"}` уводил locale в несуществующий чанк, страница вставала
 * в ошибку — а кнопка «Повторить» перезагружала её и читала то же самое.
 * Сайт умирал навсегда, и вылечить его можно было только руками.
 */
test('битое хранилище не убивает сайт', async ({ page }) => {
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
  // И кнопка темы осталась кнопкой, а не упёрлась в undefined-режим.
  await page.getByRole('button', { name: /switch theme/i }).click()
  await expect(page).toHaveURL(/theme=(system|light|dark)/)
})
