import type { Locale } from '@cv/data'
import type { z } from 'zod'
import { searchSchema, type CvSearch } from '@/routes/search'

/**
 * Режимы темы выводятся из той же схемы, что проверяет URL: отдельный union
 * рано или поздно разошёлся бы со схемой, а копия, которая мягче оригинала, —
 * это не дубликат, а дыра.
 */
export type ThemeMode = NonNullable<CvSearch['theme']>

/**
 * Хранилище проходит ту же проверку, что и ссылка.
 *
 * Раньше здесь стоял `JSON.parse(raw) as Stored` — каст без проверки, тогда как
 * URL рядом защищён `.catch(undefined)` на каждом поле. Цепочка от этого каста
 * доходила до конца: `{"lang":"zz"}` → `resolvePreferences` отдаёт
 * `locale: 'zz'` → `loadCv('zz')` ищет несуществующий импортёр и падает →
 * страница в состоянии ошибки. А кнопка «Повторить» перезагружает страницу,
 * где хранилище по-прежнему говорит `zz`: посетитель получал мёртвый сайт
 * навсегда, и вылечить его можно было только руками.
 *
 * `tech` сюда не входит намеренно: фильтр живёт в ссылке, его не запоминают.
 */
export const storedSchema = searchSchema.pick({ lang: true, theme: true })
export type Stored = z.infer<typeof storedSchema>

export type Preferences = { locale: Locale; themeMode: ThemeMode }

const STORAGE_KEY = 'cv.preferences'

/** Порядок приоритетов: ссылка → сохранённый выбор → браузер → умолчание. */
export const resolvePreferences = (
  search: CvSearch,
  stored: Stored,
  languages: readonly string[]
): Preferences => ({
  locale:
    search.lang ??
    stored.lang ??
    (languages.some((tag) => tag.toLowerCase().startsWith('uk')) ? 'uk' : 'en'),
  themeMode: search.theme ?? stored.theme ?? 'system'
})

export const readStored = (): Stored => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return {}
    /*
     * safeParse поверх `.catch(undefined)`: негодное значение поля чинит схема,
     * а не-объект целиком (строка, массив, null) — безопасный разбор.
     */
    const parsed = storedSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : {}
  } catch {
    return {} // приватный режим, запрещённое хранилище или не-JSON — не повод падать
  }
}

export const writeStored = (value: Stored): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    /* молча: настройка не сохранится, страница работает */
  }
}
