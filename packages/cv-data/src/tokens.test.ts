import { describe, expect, it } from 'vitest'
import { applyTokens } from './tokens'

describe('applyTokens', () => {
  it('substitutes a token value', () => {
    expect(
      applyTokens('Frontend engineer with {{years}} years', { years: 11 })
    ).toBe('Frontend engineer with 11 years')
  })

  it('substitutes the same token more than once', () => {
    expect(applyTokens('{{years}} / {{years}}', { years: 11 })).toBe('11 / 11')
  })

  it('throws on an unknown token, so a typo never slips silently into the PDF', () => {
    expect(() => applyTokens('{{yaers}} years', { years: 11 })).toThrow(/yaers/)
  })

  it('leaves text without tokens untouched', () => {
    expect(applyTokens('Plain text', { years: 11 })).toBe('Plain text')
  })
})
