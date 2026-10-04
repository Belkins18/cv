import { totalExperienceYears, type ResolvedCv } from '@cv/data'
import type { UiKey } from '@/i18n/en'

/**
 * A metric returns a dictionary key rather than a finished caption: the number is
 * computed here, the language is chosen in the component, and switching locale
 * requires no recomputation.
 */
export type Metric = { id: string; value: string; labelKey: UiKey }

/**
 * Not one number here is typed in by hand: everything is derived from the dataset
 * and never goes stale.
 */
export const buildMetrics = (data: ResolvedCv, now: Date): Metric[] => {
  const tech = new Set(
    [...data.roles, ...data.projects].flatMap((entry) => entry.tech)
  )
  return [
    {
      id: 'years',
      value: String(totalExperienceYears(data.roles, now)),
      labelKey: 'metric.years'
    },
    { id: 'roles', value: String(data.roles.length), labelKey: 'metric.roles' },
    {
      id: 'tech',
      value: String(tech.size),
      labelKey: 'metric.tech'
    },
    // The personal outcome only, with no internal analytics attached (design doc §10).
    { id: 'tokens', value: '8×', labelKey: 'metric.tokens' }
  ]
}
