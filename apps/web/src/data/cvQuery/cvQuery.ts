import { loadCv, type Locale, type ResolvedCv } from '@cv/data'
import { queryOptions } from '@tanstack/react-query'

export const cvQueryOptions = (locale: Locale) =>
  queryOptions<ResolvedCv>({
    queryKey: ['cv', locale],
    queryFn: () => loadCv(locale),
    staleTime: Number.POSITIVE_INFINITY // данные неизменны внутри сборки
  })
