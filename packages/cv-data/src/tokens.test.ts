import { describe, expect, it } from 'vitest'
import { applyTokens } from './tokens'

describe('applyTokens', () => {
  it('подставляет значение токена', () => {
    expect(
      applyTokens('Frontend engineer with {{years}} years', { years: 11 })
    ).toBe('Frontend engineer with 11 years')
  })

  it('подставляет один токен несколько раз', () => {
    expect(applyTokens('{{years}} / {{years}}', { years: 11 })).toBe('11 / 11')
  })

  it('бросает на неизвестном токене — опечатка не должна молча уехать в PDF', () => {
    expect(() => applyTokens('{{yaers}} years', { years: 11 })).toThrow(/yaers/)
  })

  it('не трогает текст без токенов', () => {
    expect(applyTokens('Plain text', { years: 11 })).toBe('Plain text')
  })
})
