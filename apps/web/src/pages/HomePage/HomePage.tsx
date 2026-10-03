import { useQuery } from '@tanstack/react-query'
import { cvQueryOptions } from '@/data/cvQuery'
import { useCvSearch } from '@/hooks/useCvSearch'
import { CvError } from '@/pages/CvError'
import { CvSkeleton } from '@/pages/CvSkeleton'

export const HomePage = () => {
  const { locale } = useCvSearch()
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

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold">{query.data.profile.name}</h1>
    </main>
  )
}
