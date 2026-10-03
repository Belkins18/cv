import { describe, expect, it } from 'vitest'
import {
  formatDuration,
  formatPeriod,
  monthsBetween,
  totalExperienceYears,
  visibleRoles
} from './derive'

/** Всё считается от фиксированной даты: тест не должен ломаться в следующем месяце. */
const NOW = new Date(Date.UTC(2026, 9, 3)) // 3 октября 2026

describe('monthsBetween', () => {
  it('считает включительно: июнь 2024 → октябрь 2026 это 29 месяцев', () => {
    expect(monthsBetween('2024-06', null, NOW)).toBe(29)
  })

  it('считает закрытый период', () => {
    expect(monthsBetween('2023-10', '2024-04', NOW)).toBe(7)
  })

  it('один месяц — это один месяц, а не ноль', () => {
    expect(monthsBetween('2024-06', '2024-06', NOW)).toBe(1)
  })
})

describe('totalExperienceYears', () => {
  it('отсчитывает от самой ранней роли и округляет вниз', () => {
    const roles = [
      { period: { start: '2024-06' } },
      { period: { start: '2015-01' } },
      { period: { start: '2019-01' } }
    ]
    expect(totalExperienceYears(roles, NOW)).toBe(11)
  })

  it('на пустом списке возвращает 0, а не NaN', () => {
    expect(totalExperienceYears([], NOW)).toBe(0)
  })
})

describe('formatDuration', () => {
  it.each([
    [29, 'en', '2 yr 5 mo'],
    [29, 'uk', '2 р. 5 міс.'],
    [12, 'en', '1 yr'],
    [7, 'en', '7 mo']
  ])('%i месяцев на %s', (months, locale, expected) => {
    expect(formatDuration(months as number, locale as 'en' | 'uk')).toBe(
      expected
    )
  })
})

describe('formatPeriod', () => {
  it('открытый период по-английски', () => {
    expect(formatPeriod({ start: '2024-06', end: null }, 'en')).toBe(
      'Jun 2024 — Present'
    )
  })

  it('закрытый период по-украински', () => {
    expect(formatPeriod({ start: '2023-10', end: '2024-04' }, 'uk')).toBe(
      'жовт. 2023 — квіт. 2024'
    )
  })
})

describe('visibleRoles', () => {
  it('убирает скрытые роли и сохраняет порядок', () => {
    const roles = [
      { id: 'a', detail: 'full' as const },
      { id: 'b', detail: 'hidden' as const },
      { id: 'c', detail: 'compact' as const }
    ]
    expect(visibleRoles(roles).map((r) => r.id)).toEqual(['a', 'c'])
  })
})
