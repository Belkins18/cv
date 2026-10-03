import { matchesTech } from '@cv/data'
import { useQuery } from '@tanstack/react-query'
import { cvQueryOptions } from '@/data/cvQuery'
import { Rail } from '@/features/Rail'
import { Summary } from '@/features/Summary'
import { TechFilter } from '@/features/TechFilter'
import { Timeline } from '@/features/Timeline'
import { useCvSearch } from '@/hooks/useCvSearch'
import { CvError } from '@/pages/CvError'
import { CvSkeleton } from '@/pages/CvSkeleton'

export const HomePage = () => {
  const { locale, themeMode, selected, setTech, setLocale, setThemeMode } =
    useCvSearch()
  const query = useQuery(cvQueryOptions(locale))

  if (query.isPending) return <CvSkeleton message="Loading CV" />
  if (query.isError) {
    return (
      <CvError
        message="Could not load the CV data."
        retryLabel="Retry"
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
      </main>
    </div>
  )
}
