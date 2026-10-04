import { describe, expect, it } from 'vitest'
import {
  matchesTech,
  parseTechParam,
  serializeTechParam,
  techCounts,
  techScore
} from './filter'

describe('parseTechParam', () => {
  it('parses a well-formed list', () => {
    expect(parseTechParam('react,typescript,vite')).toEqual([
      'react',
      'typescript',
      'vite'
    ])
  })

  it('drops unknown ids and keeps the valid ones, because links get hand-edited', () => {
    expect(parseTechParam('react,drogon,typescript')).toEqual([
      'react',
      'typescript'
    ])
  })

  it('tolerates junk: spaces, casing, empty items, stray commas', () => {
    expect(parseTechParam(' React , ,TYPESCRIPT,,vite ')).toEqual([
      'react',
      'typescript',
      'vite'
    ])
  })

  it('collapses duplicates', () => {
    expect(parseTechParam('react,react,react')).toEqual(['react'])
  })

  it.each([null, undefined, '', ',,,', 'drogon'])(
    'returns an empty list for %p',
    (raw) => {
      expect(parseTechParam(raw)).toEqual([])
    }
  )
})

describe('serializeTechParam', () => {
  it('sorts, so the same selection always yields the same link', () => {
    expect(serializeTechParam(['vite', 'react'])).toBe('react,vite')
  })

  it('returns undefined on an empty selection, so the parameter disappears from the URL', () => {
    expect(serializeTechParam([])).toBeUndefined()
  })
})

describe('techScore and matchesTech', () => {
  const role = { tech: ['react', 'typescript', 'vite'] } as const

  it('counts the overlapping entries', () => {
    expect(techScore(role, ['react', 'vite', 'solana'])).toBe(2)
  })

  it('matches everything when nothing is selected', () => {
    expect(matchesTech(role, [])).toBe(true)
  })

  it('treats a match on a single chip as enough', () => {
    expect(matchesTech(role, ['react', 'solana'])).toBe(true)
  })

  it('does not match when there is no overlap at all', () => {
    expect(matchesTech(role, ['solana', 'tron'])).toBe(false)
  })
})

describe('techCounts', () => {
  it('counts how many entries each technology appears in', () => {
    const counts = techCounts([
      { tech: ['react', 'vite'] },
      { tech: ['react'] }
    ])
    expect(counts.react).toBe(2)
    expect(counts.vite).toBe(1)
    expect(counts.solana).toBeUndefined()
  })
})
