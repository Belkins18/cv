import { describe, expect, it } from 'vitest'
import {
  formatDuration,
  formatPeriod,
  monthsBetween,
  totalExperienceYears,
  visibleRoles
} from './derive'

/** Everything is counted from a fixed date: the test must not break next month. */
const NOW = new Date(Date.UTC(2026, 9, 3)) // 3 October 2026

describe('monthsBetween', () => {
  it('counts inclusively: June 2024 to October 2026 is 29 months', () => {
    expect(monthsBetween('2024-06', null, NOW)).toBe(29)
  })

  it('counts a closed period', () => {
    expect(monthsBetween('2023-10', '2024-04', NOW)).toBe(7)
  })

  it('treats a single month as one month, not zero', () => {
    expect(monthsBetween('2024-06', '2024-06', NOW)).toBe(1)
  })
})

describe('totalExperienceYears', () => {
  it('counts from the earliest role and rounds down', () => {
    const roles = [
      { period: { start: '2024-06' } },
      { period: { start: '2015-01' } },
      { period: { start: '2019-01' } }
    ]
    expect(totalExperienceYears(roles, NOW)).toBe(11)
  })

  it('returns 0 rather than NaN on an empty list', () => {
    expect(totalExperienceYears([], NOW)).toBe(0)
  })
})

describe('formatDuration', () => {
  it.each([
    [29, 'en', '2 yr 5 mo'],
    [29, 'uk', '2 р. 5 міс.'],
    [12, 'en', '1 yr'],
    [7, 'en', '7 mo']
  ])('formats %i months in %s', (months, locale, expected) => {
    expect(formatDuration(months as number, locale as 'en' | 'uk')).toBe(
      expected
    )
  })
})

describe('formatPeriod', () => {
  it('renders an open-ended period in English', () => {
    expect(formatPeriod({ start: '2024-06', end: null }, 'en')).toBe(
      'Jun 2024 — Present'
    )
  })

  it('renders a closed period in Ukrainian', () => {
    expect(formatPeriod({ start: '2023-10', end: '2024-04' }, 'uk')).toBe(
      'жовт. 2023 — квіт. 2024'
    )
  })
})

describe('visibleRoles', () => {
  it('drops hidden roles and preserves the order', () => {
    const roles = [
      { id: 'a', detail: 'full' as const },
      { id: 'b', detail: 'hidden' as const },
      { id: 'c', detail: 'compact' as const }
    ]
    expect(visibleRoles(roles).map((r) => r.id)).toEqual(['a', 'c'])
  })
})
