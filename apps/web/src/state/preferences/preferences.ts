import type { Locale } from '@cv/data'
import type { CvSearch } from '@/routes/search'

/** Три режима, как в EasyFop: по умолчанию `system`, выбор сохраняется. */
export type ThemeMode = 'system' | 'light' | 'dark'
/** Эффективная тема, которую видит DOM: `system` здесь уже разрешён. */
export type Theme = 'light' | 'dark'
export type Stored = { lang?: Locale; theme?: ThemeMode }
export type Preferences = { locale: Locale; themeMode: ThemeMode; theme: Theme }

const STORAGE_KEY = 'cv.preferences'

/** Порядок приоритетов: ссылка → сохранённый выбор → браузер → умолчание. */
export const resolvePreferences = (
  search: CvSearch,
  stored: Stored,
  languages: readonly string[],
  prefersDark: boolean
): Preferences => {
  const themeMode: ThemeMode = search.theme ?? stored.theme ?? 'system'
  return {
    locale:
      search.lang ??
      stored.lang ??
      (languages.some((tag) => tag.toLowerCase().startsWith('uk'))
        ? 'uk'
        : 'en'),
    themeMode,
    theme: themeMode === 'system' ? (prefersDark ? 'dark' : 'light') : themeMode
  }
}

export const readStored = (): Stored => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw === null ? {} : (JSON.parse(raw) as Stored)
  } catch {
    return {} // приватный режим или запрещённое хранилище — не повод падать
  }
}

export const writeStored = (value: Stored): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    /* молча: настройка не сохранится, страница работает */
  }
}
