import { describe, expect, it } from 'vitest'
import { searchSchema } from './search'

describe('searchSchema', () => {
  it('lets well-formed params through', () => {
    expect(
      searchSchema.parse({ tech: 'react,vite', lang: 'uk', theme: 'light' })
    ).toEqual({
      tech: 'react,vite',
      lang: 'uk',
      theme: 'light'
    })
  })

  it('drops an unknown language instead of throwing, because a messenger may have mangled the link', () => {
    expect(searchSchema.parse({ lang: 'fr' }).lang).toBeUndefined()
  })

  it('accepts the system theme mode', () => {
    expect(searchSchema.parse({ theme: 'system' }).theme).toBe('system')
  })

  it('drops an unknown theme', () => {
    expect(searchSchema.parse({ theme: 'midnight' }).theme).toBeUndefined()
  })

  it('survives input that is junk all the way through', () => {
    expect(() =>
      searchSchema.parse({ tech: 42, lang: [], theme: null, extra: 'x' })
    ).not.toThrow()
  })
})
