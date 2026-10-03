import { totalExperienceYears, type ResolvedCv } from '@cv/data'
import type { UiKey } from '@/i18n/en'

/**
 * Метрика отдаёт ключ словаря, а не готовую подпись: число считается здесь,
 * язык выбирается в компоненте, и смена локали не требует пересчёта.
 */
export type Metric = { id: string; value: string; labelKey: UiKey }

/**
 * Ни одно число здесь не вбито руками: всё считается из датасета и не устаревает.
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
    // Личный результат, без выгрузки внутренней аналитики (дизайн §10).
    { id: 'tokens', value: '8×', labelKey: 'metric.tokens' }
  ]
}
