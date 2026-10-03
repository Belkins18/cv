import type { Detail, IsoMonth, Locale } from './types'

type YearMonth = { year: number; month: number }

const parseIsoMonth = (value: IsoMonth): YearMonth => {
  const [year, month] = value.split('-')
  return { year: Number(year), month: Number(month) }
}

const fromDate = (date: Date): YearMonth => ({
  year: date.getUTCFullYear(),
  month: date.getUTCMonth() + 1
})

const index = ({ year, month }: YearMonth): number => year * 12 + month

/** Включительно по обоим концам: июнь→июнь это один месяц, как считает LinkedIn. */
export const monthsBetween = (
  start: IsoMonth,
  end: IsoMonth | null,
  now: Date
): number =>
  index(end === null ? fromDate(now) : parseIsoMonth(end)) -
  index(parseIsoMonth(start)) +
  1

/**
 * «11 лет опыта» нигде не записано цифрой: считается от первой роли и не устаревает.
 * Перекрывающиеся роли не складываются — берётся календарная дистанция.
 */
export const totalExperienceYears = (
  roles: ReadonlyArray<{ period: { start: IsoMonth } }>,
  now: Date
): number => {
  const starts = roles.map((r) => r.period.start).sort()
  const earliest = starts[0]
  if (earliest === undefined) return 0
  return Math.floor(monthsBetween(earliest, null, now) / 12)
}

const DURATION_WORDS: Record<Locale, { year: string; month: string }> = {
  en: { year: 'yr', month: 'mo' },
  uk: { year: 'р.', month: 'міс.' }
}

export const formatDuration = (months: number, locale: Locale): string => {
  const words = DURATION_WORDS[locale]
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts: string[] = []
  if (years > 0) parts.push(`${years} ${words.year}`)
  if (rest > 0 || years === 0) parts.push(`${rest} ${words.month}`)
  return parts.join(' ')
}

const MONTH_NAMES: Record<Locale, readonly string[]> = {
  en: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  uk: [
    'січ.',
    'лют.',
    'бер.',
    'квіт.',
    'трав.',
    'черв.',
    'лип.',
    'серп.',
    'вер.',
    'жовт.',
    'лист.',
    'груд.'
  ]
}

const PRESENT: Record<Locale, string> = { en: 'Present', uk: 'дотепер' }

const formatMonth = (value: IsoMonth, locale: Locale): string => {
  const { year, month } = parseIsoMonth(value)
  const name = MONTH_NAMES[locale][month - 1] ?? value
  return `${name} ${year}`
}

export const formatPeriod = (
  period: { start: IsoMonth; end: IsoMonth | null },
  locale: Locale
): string =>
  `${formatMonth(period.start, locale)} — ${period.end === null ? PRESENT[locale] : formatMonth(period.end, locale)}`

export const visibleRoles = <T extends { detail: Detail }>(
  roles: readonly T[]
): T[] => roles.filter((role) => role.detail !== 'hidden')
