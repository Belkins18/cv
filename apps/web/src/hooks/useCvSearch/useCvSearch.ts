import {
  parseTechParam,
  serializeTechParam,
  type Locale,
  type TechId
} from '@cv/data'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import {
  readStored,
  resolvePreferences,
  writeStored,
  type ThemeMode
} from '@/state/preferences'

export const useCvSearch = () => {
  const search = useSearch({ strict: false })
  const navigate = useNavigate()

  const preferences = useMemo(
    () =>
      resolvePreferences(
        search,
        readStored(),
        typeof navigator === 'undefined' ? ['en'] : navigator.languages
      ),
    [search]
  )

  const selected = useMemo(() => parseTechParam(search.tech), [search.tech])

  /*
   * In `system` mode the attribute is REMOVED rather than written with a
   * computed value.
   *
   * There is no reason to resolve the system theme in JavaScript: `theme.css`
   * already describes both branches through `prefers-color-scheme`, and
   * `:root:not([data-theme='dark'])` lets the light scheme through exactly when
   * no explicit choice has been made. As long as this hook wrote a computed
   * `light`/`dark` here, it needed `matchMedia`, a `prefersDark` state, a
   * subscription to scheme changes and a separate `Theme` type — two dozen lines
   * duplicating what the browser works out by itself, with the comment in
   * `theme.css` describing the design better than the code implemented it.
   */
  useEffect(() => {
    const root = document.documentElement
    if (preferences.themeMode === 'system') delete root.dataset['theme']
    else root.dataset['theme'] = preferences.themeMode
    root.lang = preferences.locale
  }, [preferences.locale, preferences.themeMode])

  const setTech = (ids: readonly TechId[]): void => {
    void navigate({
      to: '/',
      search: (prev) => ({ ...prev, tech: serializeTechParam(ids) })
    })
  }

  /*
   * Only what a person actually clicked gets stored.
   *
   * Writing used to happen in an effect over the already-resolved preferences,
   * so an inferred locale went back into storage as if it had been chosen: after
   * the very first visit the "take the browser language" branch died forever,
   * and a German visitor got `en` for life, even after switching the system
   * language. A locale coming from the link is not remembered either — the
   * sender picked it, not the person who opened it.
   */
  const setLocale = (lang: Locale): void => {
    writeStored({ ...readStored(), lang })
    void navigate({ to: '/', search: (prev) => ({ ...prev, lang }) })
  }
  const setThemeMode = (theme: ThemeMode): void => {
    writeStored({ ...readStored(), theme })
    void navigate({ to: '/', search: (prev) => ({ ...prev, theme }) })
  }

  return { ...preferences, selected, setTech, setLocale, setThemeMode }
}
