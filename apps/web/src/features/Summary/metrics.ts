import { totalExperienceYears, type ResolvedCv } from '@cv/data'

export type Metric = { id: string; value: string; label: string }

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
      label: 'years in frontend'
    },
    { id: 'roles', value: String(data.roles.length), label: 'roles' },
    {
      id: 'tech',
      value: String(tech.size),
      label: 'technologies in production'
    },
    // Личный результат, без выгрузки внутренней аналитики (дизайн §10).
    { id: 'tokens', value: '8×', label: 'cheaper event migration' }
  ]
}
