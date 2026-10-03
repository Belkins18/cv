import { describe, expect, it } from 'vitest'
import { resolvePreferences } from './preferences'

describe('resolvePreferences', () => {
  it('URL важнее сохранённого выбора — присланная ссылка открывается как её собрали', () => {
    const result = resolvePreferences(
      { lang: 'uk', theme: 'light' },
      { lang: 'en', theme: 'dark' },
      ['en'],
      true
    )
    expect(result).toEqual({ locale: 'uk', themeMode: 'light', theme: 'light' })
  })

  it('без URL берёт сохранённое', () => {
    expect(
      resolvePreferences({}, { lang: 'uk', theme: 'light' }, ['en'], true)
    ).toEqual({
      locale: 'uk',
      themeMode: 'light',
      theme: 'light'
    })
  })

  it('без сохранённого берёт язык браузера, если он украинский', () => {
    expect(resolvePreferences({}, {}, ['uk-UA', 'en'], true).locale).toBe('uk')
  })

  it('режим по умолчанию — system, а эффективная тема берётся из системы', () => {
    expect(resolvePreferences({}, {}, ['de-DE'], true)).toEqual({
      locale: 'en',
      themeMode: 'system',
      theme: 'dark'
    })
    expect(resolvePreferences({}, {}, ['de-DE'], false)).toEqual({
      locale: 'en',
      themeMode: 'system',
      theme: 'light'
    })
  })

  it('явный выбор перебивает системную тему', () => {
    expect(resolvePreferences({ theme: 'light' }, {}, ['en'], true).theme).toBe(
      'light'
    )
  })
})
