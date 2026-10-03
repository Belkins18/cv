import {
  visibleRoles,
  type Locale,
  type ResolvedRole,
  type TechId
} from '@cv/data'
import { SectionTitle } from '@cv/ui'
import { useTranslation } from 'react-i18next'
import { RoleCard } from '@/features/RoleCard'

export type TimelineProps = {
  roles: readonly ResolvedRole[]
  selected: readonly TechId[]
  locale: Locale
  now: Date
}

export const Timeline = ({ roles, selected, locale, now }: TimelineProps) => {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="experience-title">
      <SectionTitle id="experience-title">
        {t('section.experience')}
      </SectionTitle>
      <div className="space-y-2">
        {visibleRoles(roles).map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            selected={selected}
            locale={locale}
            now={now}
          />
        ))}
      </div>
    </section>
  )
}
