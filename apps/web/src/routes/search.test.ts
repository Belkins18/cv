import { describe, expect, it } from 'vitest'
import { searchSchema } from './search'

describe('searchSchema', () => {
  it('пропускает корректные параметры', () => {
    expect(
      searchSchema.parse({ tech: 'react,vite', lang: 'uk', theme: 'light' })
    ).toEqual({
      tech: 'react,vite',
      lang: 'uk',
      theme: 'light'
    })
  })

  it('гасит неизвестный язык вместо падения — ссылку мог покалечить мессенджер', () => {
    expect(searchSchema.parse({ lang: 'fr' }).lang).toBeUndefined()
  })

  it('принимает системный режим темы', () => {
    expect(searchSchema.parse({ theme: 'system' }).theme).toBe('system')
  })

  it('гасит неизвестную тему', () => {
    expect(searchSchema.parse({ theme: 'midnight' }).theme).toBeUndefined()
  })

  it('переживает полностью мусорный вход', () => {
    expect(() =>
      searchSchema.parse({ tech: 42, lang: [], theme: null, extra: 'x' })
    ).not.toThrow()
  })
})
