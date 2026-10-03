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
   * В режиме `system` атрибут СНИМАЕТСЯ, а не пишется вычисленным значением.
   *
   * Разрешать системную тему в JavaScript незачем: `theme.css` уже описывает
   * обе ветки через `prefers-color-scheme`, а `:root:not([data-theme='dark'])`
   * пропускает светлую схему ровно тогда, когда явного выбора нет. Пока хук
   * писал сюда вычисленный `light`/`dark`, ради этого жили `matchMedia`,
   * состояние `prefersDark`, подписка на смену схемы и отдельный тип `Theme` —
   * два десятка строк, дублировавших то, что браузер считает сам, и комментарий
   * в `theme.css` описывал дизайн лучше, чем код его реализовывал.
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
   * Сохраняется только то, что человек нажал руками.
   *
   * Раньше запись шла эффектом от уже разрешённых предпочтений, то есть
   * выведенная локаль возвращалась в хранилище как будто это был выбор: после
   * первого же визита ветка «взять язык браузера» умирала навсегда, и немец
   * получал `en` на всю жизнь, даже сменив язык системы. Язык из ссылки тоже
   * не запоминается — его выбрал отправитель, а не тот, кто ссылку открыл.
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
