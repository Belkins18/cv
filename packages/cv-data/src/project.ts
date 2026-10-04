import { resolvedCvSchema, type Cv, type ResolvedCv } from './schema'
import type { Locale, Localized } from './types'

const isLocalized = (value: unknown): value is Localized => {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false
  const keys = Object.keys(value)
  if (keys.length !== 2 || !keys.includes('en') || !keys.includes('uk'))
    return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate['en'] === 'string' && typeof candidate['uk'] === 'string'
  )
}

const walk = (value: unknown, locale: Locale): unknown => {
  if (isLocalized(value)) return value[locale]
  if (Array.isArray(value)) return value.map((item) => walk(item, locale))
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, walk(item, locale)])
    )
  }
  return value
}

/** One dataset, two renders: architecturally they cannot diverge in content. */
export const project = (source: Cv, locale: Locale): ResolvedCv =>
  resolvedCvSchema.parse(walk(source, locale))
