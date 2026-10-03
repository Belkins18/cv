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

export const HomePage = () => {
  const { locale, themeMode, selected, setTech, setLocale, setThemeMode } =
    useCvSearch()
  const query = useQuery(cvQueryOptions(locale))
  const { t, i18n } = useTranslation()
  const [helpOpen, setHelpOpen] = useState(false)

  // Локаль живёт в URL и ведёт данные; хром интерфейса обязан идти за ней,
  // иначе украинское резюме получает английские подписи кнопок.
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
        onRetry={() => void query.refetch()}
      />
    )
  }

  const now = new Date()
  // Счётчик считается по всем записям, а не только по ролям: фильтр описывает
  // весь стек резюме, и «ничего не совпало» обязано означать именно это.
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
