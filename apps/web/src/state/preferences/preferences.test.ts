import { afterEach, describe, expect, it } from 'vitest'
import { readStored, resolvePreferences, writeStored } from './preferences'

afterEach(() => window.localStorage.clear())

describe('resolvePreferences', () => {
  it('URL важнее сохранённого выбора — присланная ссылка открывается как её собрали', () => {
    const result = resolvePreferences(
      { lang: 'uk', theme: 'light' },
      { lang: 'en', theme: 'dark' },
      ['en']
    )
    expect(result).toEqual({ locale: 'uk', themeMode: 'light' })
  })

  it('без URL берёт сохранённое', () => {
    expect(
      resolvePreferences({}, { lang: 'uk', theme: 'light' }, ['en'])
    ).toEqual({ locale: 'uk', themeMode: 'light' })
  })

  it('без сохранённого берёт язык браузера, если он украинский', () => {
    expect(resolvePreferences({}, {}, ['uk-UA', 'en']).locale).toBe('uk')
  })

  it('режим по умолчанию — system: эффективную тему выбирает CSS, а не JS', () => {
    expect(resolvePreferences({}, {}, ['de-DE'])).toEqual({
      locale: 'en',
      themeMode: 'system'
    })
  })
})

/*
 * Хранилище правит кто угодно: посетитель через devtools, расширение, прошлая
 * версия сайта с другой формой записи. Непроверенное значение отсюда доходило
 * до `loadCv(locale)` и убивало страницу навсегда — перезагрузка, которую
 * предлагает кнопка «Повторить», читала то же самое битое значение.
 */
describe('readStored', () => {
  const write = (raw: string): void =>
    window.localStorage.setItem('cv.preferences', raw)

  it('пустое хранилище — пустые предпочтения', () => {
    expect(readStored()).toEqual({})
  })

  it('возвращает валидное как есть', () => {
    writeStored({ lang: 'uk', theme: 'dark' })
    expect(readStored()).toEqual({ lang: 'uk', theme: 'dark' })
  })

  it.each([
    ['несуществующая локаль', '{"lang":"zz"}'],
    ['несуществующая тема', '{"theme":"banana"}'],
    ['число вместо строки', '{"lang":7,"theme":false}']
  ])('гасит негодное поле: %s', (_label, raw) => {
    write(raw)
    const stored = readStored()
    expect(stored.lang).toBeUndefined()
    expect(stored.theme).toBeUndefined()
    // И главное: разрешение не выдумывает локаль, для которой нет чанка.
    expect(resolvePreferences({}, stored, ['en']).locale).toBe('en')
  })

  it.each([
    ['не JSON', 'не json вовсе'],
    ['массив', '[1,2,3]'],
    ['строка', '"uk"'],
    ['null', 'null']
  ])('переживает не-объект: %s', (_label, raw) => {
    write(raw)
    expect(readStored()).toEqual({})
  })

  it('годное поле выживает рядом с негодным', () => {
    write('{"lang":"uk","theme":"banana"}')
    expect(readStored().lang).toBe('uk')
    expect(readStored().theme).toBeUndefined()
  })
})
