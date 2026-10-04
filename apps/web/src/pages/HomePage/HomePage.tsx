import { matchesTech } from '@cv/data'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cvQueryOptions } from '@/data/cvQuery'
import { Credentials } from '@/features/Credentials'
import { Projects } from '@/features/Projects'
import { Rail } from '@/features/Rail'
import { ShortcutsDialog } from '@/features/ShortcutsDialog'
import { Summary } from '@/features/Summary'
import { TechFilter } from '@/features/TechFilter'
import { Timeline } from '@/features/Timeline'
import { useCvSearch } from '@/hooks/useCvSearch'
import { useShortcuts } from '@/hooks/useShortcuts'
import { CvError } from '@/pages/CvError'
import { CvSkeleton } from '@/pages/CvSkeleton'
import { reloadPage } from '@/utils/reloadPage'

export const HomePage = () => {
  const { locale, themeMode, selected, setTech, setLocale, setThemeMode } =
    useCvSearch()
  const query = useQuery(cvQueryOptions(locale))
  const { t, i18n } = useTranslation()
  const [helpOpen, setHelpOpen] = useState(false)

  // The locale lives in the URL and drives the data; the interface chrome has to
  // follow it, or a Ukrainian resume ends up with English button labels.
  useEffect(() => {
    void i18n.changeLanguage(locale)
  }, [i18n, locale])

  const focusFilter = useCallback(() => {
    document
      .querySelector<HTMLElement>("#tech-filter [role='checkbox']")
      ?.focus()
  }, [])
  const toggleHelp = useCallback(() => setHelpOpen((value) => !value), [])
  useShortcuts({ onFocusFilter: focusFilter, onToggleHelp: toggleHelp })

  if (query.isPending) return <CvSkeleton message={t('state.loading')} />
  if (query.isError) {
    return (
      <CvError
        message={t('state.error')}
        retryLabel={t('state.retry')}
        /*
         * Retry means a full page reload, not a refetch, and that is not
         * laziness. The locale data arrives through a dynamic `import()`, and
         * the browser caches a FAILED import: the module-map entry becomes null
         * forever, and the next `import()` of the same URL fails without ever
         * touching the network. Confirmed by e2e: once the chunk has failed,
         * there is not a single further request for it, however many times you
         * click. That is the only failure `loadCv` can produce, so a refetch
         * here would be a button that does nothing. A reload builds the module
         * map from scratch, and the filter, the language and the theme all live
         * in the URL — there is nothing to lose.
         */
        onRetry={reloadPage}
      />
    )
  }

  const now = new Date()
  // The count runs over every entry, not just the roles: the filter describes
  // the resume's whole stack, and "nothing matched" has to mean exactly that.
  const entries = [...query.data.roles, ...query.data.projects]
  const matchCount = entries.filter((entry) =>
    matchesTech(entry, selected)
  ).length

  return (
    <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
      <Rail
        data={query.data}
        locale={locale}
        themeMode={themeMode}
        onLocale={setLocale}
        onThemeMode={setThemeMode}
      />
      <main className="min-w-0 flex-1 space-y-10 p-6">
        <Summary data={query.data} now={now} />
        <TechFilter
          entries={entries}
          selected={selected}
          onChange={setTech}
          matchCount={matchCount}
        />
        <Timeline
          roles={query.data.roles}
          selected={selected}
          locale={locale}
          now={now}
        />
        <Projects projects={query.data.projects} selected={selected} />
        <Credentials
          certificates={query.data.certificates}
          education={query.data.education}
          languages={query.data.languages}
        />
      </main>
      <ShortcutsDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
