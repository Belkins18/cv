import { useQuery } from '@tanstack/react-query'
import { cvQueryOptions } from '@/data/cvQuery'
import { Rail } from '@/features/Rail'
import { Summary } from '@/features/Summary'
import { useCvSearch } from '@/hooks/useCvSearch'
import { CvError } from '@/pages/CvError'
import { CvSkeleton } from '@/pages/CvSkeleton'

export const HomePage = () => {
  const { locale, themeMode, setLocale, setThemeMode } = useCvSearch()
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
      </main>
    </div>
  )
}
