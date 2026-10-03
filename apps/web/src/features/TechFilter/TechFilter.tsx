import { TECH, techCounts, type TechId } from '@cv/data'
import { Chip, SectionTitle } from '@cv/ui'
import { useId, useMemo } from 'react'

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
   * Пары, а не ключи: techCounts отдаёт Partial-запись, и при
   * noUncheckedIndexedAccess обращение counts[id] снова стало бы
   * `number | undefined`, которое Chip с exactOptionalPropertyTypes не примет.
   * Ключ и счётчик приезжают вместе — значит, счётчик есть по построению.
   */
  const ranked = useMemo(
    () =>
      (Object.entries(techCounts(entries)) as Array<[TechId, number]>).sort(
        ([, left], [, right]) => right - left
      ),
    [entries]
  )
  const listId = useId()

  const toggle = (id: TechId): void => {
    onChange(
      selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id]
    )
  }

  return (
    <section aria-labelledby="filter-title" id="tech-filter">
      <SectionTitle id="filter-title">Filter by stack</SectionTitle>
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
        Пустой результат — не пустая страница: карточки ниже остаются на месте
        погашенными, а здесь человек видит, что именно произошло, и чем это снять.
      */}
      {selected.length > 0 && matchCount === 0 && (
        <p role="status" className="mt-3 text-sm text-ink-muted">
          Nothing matches this stack — the cards below are all dimmed.{' '}
          <button
            type="button"
            data-testid="filter-reset"
            onClick={() => onChange([])}
            className="underline"
          >
            Reset the filter
          </button>
        </p>
      )}
    </section>
  )
}
