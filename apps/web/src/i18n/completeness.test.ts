import { describe, expect, it } from 'vitest'
import { en } from './en'
import { uk } from './uk'

describe('the interface dictionaries', () => {
  it('carry the same set of keys, so a translation cannot be forgotten', () => {
    expect(Object.keys(uk).sort()).toEqual(Object.keys(en).sort())
  })

  it('contain no empty strings', () => {
    for (const [key, value] of [...Object.entries(en), ...Object.entries(uk)]) {
      expect(value, key).not.toBe('')
    }
  })

  // A forgotten translation looks like an ordinary string: the dictionary is
  // complete and the value is simply copied from the English one. Requiring
  // Cyrillic in every value is a cheap check that catches that copy.
  it('leaves no Ukrainian value still in English', () => {
    for (const [key, value] of Object.entries(uk)) {
      expect(value, key).not.toBe(en[key as keyof typeof en])
      expect(value, key).toMatch(/[Ѐ-ӿ]/)
    }
  })
})
