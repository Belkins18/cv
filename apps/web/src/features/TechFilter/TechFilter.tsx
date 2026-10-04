import { TECH, techCounts, type TechId } from '@cv/data'
import { Chip, SectionTitle } from '@cv/ui'
import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export type TechFilterProps = {
  entries: ReadonlyArray<{ tech: readonly TechId[] }>
  selected: readonly TechId[]
  onChange: (next: TechId[]) => void
  matchCount: number
}

export const TechFilter = ({
  entries,
  selected,
  onChange,
  matchCount
}: TechFilterProps) => {
  /*
   * Pairs, not keys: techCounts returns a Partial record, so under
   * noUncheckedIndexedAccess reading counts[id] would be `number | undefined`
   * again, which Chip under exactOptionalPropertyTypes will not accept. The key
   * and the count arrive together, so by construction the count exists.
   */
  const ranked = useMemo(
    () =>
      (Object.entries(techCounts(entries)) as Array<[TechId, number]>).sort(
        ([, left], [, right]) => right - left
      ),
    [entries]
  )
  const listId = useId()
  const { t } = useTranslation()

  const toggle = (id: TechId): void => {
    onChange(
      selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id]
    )
  }

  return (
    <section aria-labelledby="filter-title" id="tech-filter">
      <SectionTitle id="filter-title">{t('section.filter')}</SectionTitle>
      <div id={listId} className="flex flex-wrap gap-1.5">
        {ranked.map(([id, count]) => (
          <Chip
            key={id}
            label={TECH[id].label}
            count={count}
            selected={selected.includes(id)}
            onToggle={() => toggle(id)}
          />
        ))}
      </div>
      {/*
        An empty result is not an empty page: the cards below stay where they are,
        dimmed, while right here the visitor sees what happened and what undoes it.
      */}
      {selected.length > 0 && matchCount === 0 && (
        <p role="status" className="mt-3 text-sm text-ink-muted">
          {t('filter.empty')}{' '}
          <button
            type="button"
            data-testid="filter-reset"
            onClick={() => onChange([])}
            className="underline"
          >
            {t('filter.reset')}
          </button>
        </p>
      )}
    </section>
  )
}
