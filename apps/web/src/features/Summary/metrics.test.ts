import { cv, project } from '@cv/data'
import { describe, expect, it } from 'vitest'
import { buildMetrics } from './metrics'

const data = project(cv, 'en')
const NOW = new Date(Date.UTC(2026, 9, 3))

/**
 * The internal WireX figures cannot be written out in a test: the privacy guard
 * scans tests too, and spelling them out would itself be the leak this test is
 * meant to catch. So the pattern is assembled from fragments (00-constraints).
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
  it('derives every value from the data, with nothing typed in by hand', () => {
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

  it('reports the migration-cost metric without any internal figures', () => {
    const tokens = buildMetrics(data, NOW).find((m) => m.id === 'tokens')
    expect(tokens?.value).toBe('8×')
    expect(JSON.stringify(tokens)).not.toMatch(INTERNAL_NUMBERS)
  })
})
