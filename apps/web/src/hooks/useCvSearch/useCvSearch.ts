import {
  parseTechParam,
  serializeTechParam,
  type Locale,
  type TechId
} from '@cv/data'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import {
  readStored,
  resolvePreferences,
  writeStored,
  type ThemeMode
} from '@/state/preferences'

/**
 * `matchMedia` может не существовать: его нет при серверном рендере и нет в
 * jsdom. Отсутствие API — не отказ страницы: без него режим `system`
 * разрешается в светлую тему, а явный выбор работает как работал.
 */
const prefersDarkQuery = (): MediaQueryList | null =>
  typeof window === 'undefined' || typeof window.matchMedia !== 'function'
    ? null
    : window.matchMedia('(prefers-color-scheme: dark)')

export const useCvSearch = () => {
  const search = useSearch({ strict: false })
  const navigate = useNavigate()
  const [prefersDark, setPrefersDark] = useState(
    () => prefersDarkQuery()?.matches ?? false
  )

  // Режим system обязан следовать за системой, пока страница открыта.
  useEffect(() => {
    const query = prefersDarkQuery()
    if (query === null) return
    const listener = (event: MediaQueryListEvent): void =>
      setPrefersDark(event.matches)
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }, [])

  const preferences = useMemo(
    () =>
      resolvePreferences(
        search,
        readStored(),
        typeof navigator === 'undefined' ? ['en'] : navigator.languages,
        prefersDark
      ),
    [search, prefersDark]
  )

  const selected = useMemo(() => parseTechParam(search.tech), [search.tech])

  useEffect(() => {
    document.documentElement.dataset['theme'] = preferences.theme
    document.documentElement.lang = preferences.locale
    writeStored({ lang: preferences.locale, theme: preferences.themeMode })
  }, [preferences.locale, preferences.theme, preferences.themeMode])

  const setTech = (ids: readonly TechId[]): void => {
    void navigate({
      to: '/',
      search: (prev) => ({ ...prev, tech: serializeTechParam(ids) })
    })
  }
  const setLocale = (lang: Locale): void => {
    void navigate({ to: '/', search: (prev) => ({ ...prev, lang }) })
  }
  const setThemeMode = (theme: ThemeMode): void => {
    void navigate({ to: '/', search: (prev) => ({ ...prev, theme }) })
  }

  return { ...preferences, selected, setTech, setLocale, setThemeMode }
}
