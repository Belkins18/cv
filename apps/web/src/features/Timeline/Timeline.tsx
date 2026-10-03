import {
  visibleRoles,
  type Locale,
  type ResolvedRole,
  type TechId
} from '@cv/data'
import { SectionTitle } from '@cv/ui'
import { RoleCard } from '@/features/RoleCard'

export type TimelineProps = {
  roles: readonly ResolvedRole[]
  selected: readonly TechId[]
  locale: Locale
  now: Date
}

export const Timeline = ({ roles, selected, locale, now }: TimelineProps) => (
  <section aria-labelledby="experience-title">
    <SectionTitle id="experience-title">Experience</SectionTitle>
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
