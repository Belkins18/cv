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
 * Погашенная карточка остаётся в документе и остаётся раскрываемой: фильтр
 * подсвечивает совпадения, а не прячет историю.
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
          Кнопка появляется только у карточки, которой есть что раскрыть.
          Конституция требует держать опыт до 2019 одной строкой `compact`
          без буллетов — и у неё кнопка объявляла бы `aria-expanded`
          и `aria-controls`, указывающий в никуда: скринридер говорил бы
          «свёрнуто», нажатие не делало бы ничего.
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
          Страна рендерится в PDF и обязана рендериться здесь: без неё читатель
          не понимает, что ownix и Poollotto были израильскими — а слово Israel
          вернули в датасет отдельным решением.
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
