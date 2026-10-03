import { describe, expect, it } from 'vitest'
import {
  matchesTech,
  parseTechParam,
  serializeTechParam,
  techCounts,
  techScore
} from './filter'

describe('parseTechParam', () => {
  it('разбирает нормальный список', () => {
    expect(parseTechParam('react,typescript,vite')).toEqual([
      'react',
      'typescript',
      'vite'
    ])
  })

  it('выбрасывает неизвестные id, но сохраняет валидные — ссылку правят руками', () => {
    expect(parseTechParam('react,drogon,typescript')).toEqual([
      'react',
      'typescript'
    ])
  })

  it('терпит мусор: пробелы, регистр, пустые элементы, лишние запятые', () => {
    expect(parseTechParam(' React , ,TYPESCRIPT,,vite ')).toEqual([
      'react',
      'typescript',
      'vite'
    ])
  })

  it('схлопывает дубликаты', () => {
    expect(parseTechParam('react,react,react')).toEqual(['react'])
  })

  it.each([null, undefined, '', ',,,', 'drogon'])(
    'на %p возвращает пустой список',
    (raw) => {
      expect(parseTechParam(raw)).toEqual([])
    }
  )
})

describe('serializeTechParam', () => {
  it('сортирует — одна и та же выборка даёт одну и ту же ссылку', () => {
    expect(serializeTechParam(['vite', 'react'])).toBe('react,vite')
  })

  it('на пустой выборке возвращает undefined, чтобы параметр исчез из URL', () => {
    expect(serializeTechParam([])).toBeUndefined()
  })
})

describe('techScore и matchesTech', () => {
  const role = { tech: ['react', 'typescript', 'vite'] } as const

  it('считает число пересечений', () => {
    expect(techScore(role, ['react', 'vite', 'solana'])).toBe(2)
  })

  it('без выбора совпадают все', () => {
    expect(matchesTech(role, [])).toBe(true)
  })

  it('совпадение по одному чипу достаточно', () => {
    expect(matchesTech(role, ['react', 'solana'])).toBe(true)
  })

  it('без единого пересечения не совпадает', () => {
    expect(matchesTech(role, ['solana', 'tron'])).toBe(false)
  })
})

describe('techCounts', () => {
  it('считает, в скольких записях встречается каждая технология', () => {
    const counts = techCounts([
      { tech: ['react', 'vite'] },
      { tech: ['react'] }
    ])
    expect(counts.react).toBe(2)
    expect(counts.vite).toBe(1)
    expect(counts.solana).toBeUndefined()
  })
})
