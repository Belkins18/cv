import type { Locale } from '@cv/data'
import type { z } from 'zod'
import { searchSchema, type CvSearch } from '@/routes/search'

/**
 * The theme modes are derived from the same schema that validates the URL: a
 * separate union would sooner or later drift away from it, and a copy that is
 * softer than the original is not a duplicate, it is a hole.
 */
export type ThemeMode = NonNullable<CvSearch['theme']>

/**
 * Stored preferences go through the same validation as the link does.
 *
 * This used to be `JSON.parse(raw) as Stored` — a cast with no check, while the
 * URL right next to it is guarded by `.catch(undefined)` on every field. The
 * chain from that cast ran all the way: `{"lang":"zz"}` → `resolvePreferences`
 * returns `locale: 'zz'` → `loadCv('zz')` looks for an importer that does not
 * exist and throws → the page lands in its error state. And the "Retry" button
 * reloads a page whose storage still says `zz`: the visitor got a permanently
 * dead site, curable only by hand.
 *
 * `tech` is deliberately left out: the filter lives in the link and is not
 * remembered.
 */
export const storedSchema = searchSchema.pick({ lang: true, theme: true })
export type Stored = z.infer<typeof storedSchema>

export type Preferences = { locale: Locale; themeMode: ThemeMode }

const STORAGE_KEY = 'cv.preferences'

/** Priority order: the link, then the saved choice, then the browser, then the default. */
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
     * safeParse on top of `.catch(undefined)`: a bad field value is repaired by
     * the schema, while a value that is not an object at all (a string, an
     * array, null) is handled by parsing safely.
     */
    const parsed = storedSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : {}
  } catch {
    return {} // private mode, blocked storage or non-JSON is no reason to crash
  }
}

export const writeStored = (value: Stored): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    /* silently: the preference will not persist, the page keeps working */
  }
}
