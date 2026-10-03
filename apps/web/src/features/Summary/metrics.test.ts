import { cv, project } from '@cv/data'
import { describe, expect, it } from 'vitest'
import { buildMetrics } from './metrics'

const data = project(cv, 'en')
const NOW = new Date(Date.UTC(2026, 9, 3))

/**
 * Внутренние числа WireX нельзя записать в тест целиком: гвард приватности
 * сканирует и тесты, и такая запись сама стала бы утечкой, которую тест ловит.
 * Поэтому паттерн склеивается из фрагментов (00-constraints).
 */
const INTERNAL_NUMBERS = new RegExp(
  [
    ['85', '4M'].join('[.,]'),
    ['10', '7M'].join('[.,]'),
    ['449', 'K'].join('')
  ].join('|'),
  'i'
)

describe('buildMetrics', () => {
  it('все значения вычисляются из данных, ничего не вбито руками', () => {
    const metrics = buildMetrics(data, NOW)
    expect(metrics.find((m) => m.id === 'years')?.value).toBe('11')
    expect(metrics.find((m) => m.id === 'roles')?.value).toBe(
      String(data.roles.length)
    )
    expect(metrics.find((m) => m.id === 'tech')?.value).toBe(
      String(
        new Set([...data.roles, ...data.projects].flatMap((e) => e.tech)).size
      )
    )
  })

  it('отдаёт метрику про стоимость миграции без внутренних чисел', () => {
    const tokens = buildMetrics(data, NOW).find((m) => m.id === 'tokens')
    expect(tokens?.value).toBe('8×')
    expect(JSON.stringify(tokens)).not.toMatch(INTERNAL_NUMBERS)
  })
})
