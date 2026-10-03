import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { cvSchema } from '../schema'
import { totalExperienceYears } from '../derive'
import { applyTokens } from '../tokens'
import { contacts, profile } from './profile'
import { roles } from './experience'

const NOW = new Date(Date.UTC(2026, 9, 3))
const rolesSchema = cvSchema.shape.roles

/**
 * Запрещённые строки собраны из фрагментов намеренно. Записанные целиком, они
 * превращают в утечку сам тест: `pnpm guard` сканирует все отслеживаемые файлы и
 * честно падает на нём. Добавлять этот файл в список SELF гварда нельзя — рядом
 * лежат настоящие данные резюме, и слепое пятно появилось бы ровно там, где
 * сканер нужнее всего.
 *
 * Канонический словарь — `tools/repo-guard/privacy.test.ts`; здесь те же четыре
 * числа WireX из Global Constraints. Короткие `1122` и `66` привязаны к контексту,
 * иначе они ловят версии и хэши.
 */
const INTERNAL_WIREX_NUMBERS = new RegExp(
  [
    ['85', '4M'].join('\\.'),
    ['10', '7M'].join('\\.'),
    ['449', 'K'].join(''),
    ['150', 'K'].join(''),
    ['558', '51'].join(''),
    ['1122', '[\\s-]*(стро|рядк|line)'].join(''),
    ['66', '\\s+(схем|schema)'].join('')
  ].join('|')
)

const CYBER_WORD = new RegExp(['cyber', 'security'].join(' ?'), 'i')

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

  it('BSAFE не фигурирует как работодатель', () => {
    expect(JSON.stringify(roles)).not.toMatch(/BSAFE/i)
  })

  // Название теста тоже сканируется гвардом, поэтому запрещённое слово в нём не пишется:
  // домен WireX по Global Constraints описывается как анализ сетевых протоколов.
  it('запрещённое слово-домен не используется', () => {
    expect(JSON.stringify(roles)).not.toMatch(CYBER_WORD)
  })

  it('внутренние числа WireX не попали в текст', () => {
    expect(JSON.stringify(roles)).not.toMatch(INTERNAL_WIREX_NUMBERS)
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
    expect(JSON.stringify(contacts)).not.toMatch(/380\d{9}/)
  })

  it('summary подставляет актуальный стаж и не оставляет сырых токенов', () => {
    const years = totalExperienceYears(roles, NOW)
    const rendered = applyTokens(profile.summary.en, { years })
    expect(rendered).toContain('11 years')
    expect(rendered).not.toContain('{{')
  })
})
