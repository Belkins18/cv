import { applyTokens, totalExperienceYears, type ResolvedCv } from '@cv/data'
import { MetricTile } from '@cv/ui'
import { useTranslation } from 'react-i18next'
import { buildMetrics } from './metrics'

export type SummaryProps = { data: ResolvedCv; now: Date }

export const Summary = ({ data, now }: SummaryProps) => {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="summary-title" className="space-y-4">
      <h2 id="summary-title" className="sr-only">
        {t('section.summary')}
      </h2>
      <p className="max-w-3xl text-lg leading-relaxed text-ink">
        {applyTokens(data.profile.summary, {
          years: totalExperienceYears(data.roles, now)
        })}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {buildMetrics(data, now).map((metric) => (
          <MetricTile
            key={metric.id}
            value={metric.value}
            label={t(metric.labelKey)}
          />
        ))}
      </div>
    </section>
  )
}
