import { isTechId, type TechId } from './tech'

type HasTech = { readonly tech: readonly TechId[] }

/** URL правят руками и ломают мессенджеры: неизвестное молча отбрасывается, валидное остаётся. */
export const parseTechParam = (raw: string | null | undefined): TechId[] => {
  if (!raw) return []
  const selected = new Set<TechId>()
  for (const part of raw.split(',')) {
    const id = part.trim().toLowerCase()
    if (isTechId(id)) selected.add(id)
  }
  return [...selected]
}

export const serializeTechParam = (
  ids: readonly TechId[]
): string | undefined =>
  ids.length === 0 ? undefined : [...ids].sort().join(',')

export const techScore = (
  entry: HasTech,
  selected: readonly TechId[]
): number => entry.tech.filter((id) => selected.includes(id)).length

/** Мультивыбор — ИЛИ: пересечение по одному чипу уже показывает соответствие. */
export const matchesTech = (
  entry: HasTech,
  selected: readonly TechId[]
): boolean => selected.length === 0 || techScore(entry, selected) > 0

export const techCounts = (
  entries: readonly HasTech[]
): Partial<Record<TechId, number>> => {
  const counts: Partial<Record<TechId, number>> = {}
  for (const entry of entries) {
    for (const id of entry.tech) counts[id] = (counts[id] ?? 0) + 1
  }
  return counts
}
