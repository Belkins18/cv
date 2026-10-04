import { afterEach, describe, expect, it } from 'vitest'
import { readStored, resolvePreferences, writeStored } from './preferences'

afterEach(() => window.localStorage.clear())

describe('resolvePreferences', () => {
  it('lets the URL win over the saved choice, so a link opens the way it was built', () => {
    const result = resolvePreferences(
      { lang: 'uk', theme: 'light' },
      { lang: 'en', theme: 'dark' },
      ['en']
    )
    expect(result).toEqual({ locale: 'uk', themeMode: 'light' })
  })

  it('falls back to the saved choice when the URL says nothing', () => {
    expect(
      resolvePreferences({}, { lang: 'uk', theme: 'light' }, ['en'])
    ).toEqual({ locale: 'uk', themeMode: 'light' })
  })

  it('falls back to the browser language when it is Ukrainian', () => {
    expect(resolvePreferences({}, {}, ['uk-UA', 'en']).locale).toBe('uk')
  })

  it('defaults to system mode, leaving the effective theme to CSS rather than JS', () => {
    expect(resolvePreferences({}, {}, ['de-DE'])).toEqual({
      locale: 'en',
      themeMode: 'system'
    })
  })
})

/*
 * Anyone edits this storage: the visitor through devtools, an extension, an older
 * version of the site that wrote a different shape. An unvalidated value from
 * here reached `loadCv(locale)` and killed the page for good — the reload the
 * retry button offers read the very same broken value back.
 */
describe('readStored', () => {
  const write = (raw: string): void =>
    window.localStorage.setItem('cv.preferences', raw)

  it('returns empty preferences for empty storage', () => {
    expect(readStored()).toEqual({})
  })

  it('returns a valid record as it is', () => {
    writeStored({ lang: 'uk', theme: 'dark' })
    expect(readStored()).toEqual({ lang: 'uk', theme: 'dark' })
  })

  it.each([
    ['a locale that does not exist', '{"lang":"zz"}'],
    ['a theme that does not exist', '{"theme":"banana"}'],
    ['a number where a string belongs', '{"lang":7,"theme":false}']
  ])('drops an unusable field: %s', (_label, raw) => {
    write(raw)
    const stored = readStored()
    expect(stored.lang).toBeUndefined()
    expect(stored.theme).toBeUndefined()
    // And, crucially: resolution never invents a locale that has no chunk.
    expect(resolvePreferences({}, stored, ['en']).locale).toBe('en')
  })

  it.each([
    ['not JSON at all', 'not json at all'],
    ['an array', '[1,2,3]'],
    ['a string', '"uk"'],
    ['null', 'null']
  ])('survives a value that is not an object: %s', (_label, raw) => {
    write(raw)
    expect(readStored()).toEqual({})
  })

  it('keeps a usable field next to an unusable one', () => {
    write('{"lang":"uk","theme":"banana"}')
    expect(readStored().lang).toBe('uk')
    expect(readStored().theme).toBeUndefined()
  })
})
