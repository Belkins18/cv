import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { cvSchema } from '../schema'
import { totalExperienceYears } from '../derive'
import { applyTokens } from '../tokens'
import { contacts, profile } from './profile'
import { roles } from './experience'
import {
  FORBIDDEN_CONTENT,
  FORBIDDEN_IN_RESUME,
  PHONE
} from '../../../../tools/repo-guard/patterns'

const NOW = new Date(Date.UTC(2026, 9, 3))
const rolesSchema = cvSchema.shape.roles

describe('датасет опыта', () => {
  it('проходит схему', () => {
    expect(() => rolesSchema.parse(roles)).not.toThrow()
  })

  it('идёт от новых к старым', () => {
    const starts = roles.map((r) => r.period.start)
    expect([...starts].sort().reverse()).toEqual(starts)
  })

  it('стаж от первой роли даёт 11 лет на октябрь 2026', () => {
    expect(totalExperienceYears(roles, NOW)).toBe(11)
  })

  it('опыт до 2019 года свёрнут в одну строку без названия компании', () => {
    const compact = roles.filter((r) => r.detail === 'compact')
    expect(compact).toHaveLength(1)
    expect(compact[0]?.company).toBeUndefined()
    expect(compact[0]?.period.end).toBe('2018-12')
  })

  // Словарь запрещённого живёт в tools/repo-guard/patterns.ts и импортируется:
  // копия паттерна, которая оказалась мягче оригинала, — не дубликат, а дыра.
  // Заголовки тестов тоже сканируются гвардом, поэтому имя подставляет it.each.
  it.each(FORBIDDEN_IN_RESUME)('не содержит: %s', (_label, pattern) => {
    expect(JSON.stringify(roles)).not.toMatch(pattern)
  })

  it.each(FORBIDDEN_CONTENT)('не содержит: %s', (_label, pattern) => {
    expect(JSON.stringify(roles)).not.toMatch(pattern)
  })
})

describe('профиль', () => {
  it('проходит схему', () => {
    expect(() =>
      z
        .object({
          profile: cvSchema.shape.profile,
          contacts: cvSchema.shape.contacts
        })
        .parse({ profile, contacts })
    ).not.toThrow()
  })

  it('телефона в данных нет — он подставляется только в сборке PDF', () => {
    expect(JSON.stringify(contacts)).not.toMatch(PHONE)
  })

  it('summary подставляет актуальный стаж и не оставляет сырых токенов', () => {
    const years = totalExperienceYears(roles, NOW)
    const rendered = applyTokens(profile.summary.en, { years })
    expect(rendered).toContain('11 years')
    expect(rendered).not.toContain('{{')
  })
})
