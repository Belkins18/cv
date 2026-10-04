import {
  formatDuration,
  formatPeriod,
  matchesTech,
  monthsBetween,
  TECH,
  type Locale,
  type ResolvedRole,
  type TechId
} from '@cv/data'
import { Card } from '@cv/ui'
import { useId, useState } from 'react'

export type RoleCardProps = {
  role: ResolvedRole
  selected: readonly TechId[]
  locale: Locale
  now: Date
}

/**
 * A dimmed card stays in the document and stays expandable: the filter
 * highlights matches, it does not hide history.
 */
export const RoleCard = ({ role, selected, locale, now }: RoleCardProps) => {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const dimmed = !matchesTech(role, selected)
  const months = monthsBetween(role.period.start, role.period.end, now)
  const expandable = role.bullets.length > 0

  const header = (
    <>
      <span>
        <span className="font-semibold text-ink">{role.title}</span>
        {role.company !== undefined && (
          <span className="text-ink-muted"> · {role.company}</span>
        )}
      </span>
      <span className="shrink-0 font-mono text-xs text-ink-muted">
        {formatPeriod(role.period, locale)} · {formatDuration(months, locale)}
      </span>
    </>
  )
  const headerClass = 'flex w-full items-baseline justify-between gap-4'

  return (
    <article data-testid={`role-${role.id}`} data-dimmed={dimmed}>
      <Card dimmed={dimmed}>
        {/*
          The button appears only on a card that has something to expand. The
          project's rules keep everything before 2019 as a single `compact` line
          with no bullets — and there the button would announce `aria-expanded`
          plus an `aria-controls` pointing at nothing: a screen reader would say
          "collapsed", and pressing it would do nothing at all.
        */}
        {expandable ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className={`${headerClass} text-left`}
          >
            {header}
          </button>
        ) : (
          <div className={headerClass}>{header}</div>
        )}
        {/*
          The country is rendered in the PDF and has to be rendered here too:
          without it the reader has no way of knowing that ownix and Poollotto
          were Israeli — and the word Israel was put back into the dataset by a
          deliberate decision.
        */}
        {role.location !== undefined && (
          <p className="mt-1 text-xs text-ink-muted">{role.location}</p>
        )}
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {role.tech.map((id) => (
            <li
              key={id}
              className="rounded-full border border-border px-2 py-0.5 text-xs text-ink-muted"
            >
              {TECH[id].label}
            </li>
          ))}
        </ul>
        {open && expandable && (
          <ul
            id={panelId}
            className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink"
          >
            {role.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
      </Card>
    </article>
  )
}
