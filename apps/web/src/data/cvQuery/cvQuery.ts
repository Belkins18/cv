import { loadCv, type Locale, type ResolvedCv } from '@cv/data'
import { queryOptions } from '@tanstack/react-query'

export const cvQueryOptions = (locale: Locale) =>
  queryOptions<ResolvedCv>({
    queryKey: ['cv', locale],
    queryFn: () => loadCv(locale),
    staleTime: Number.POSITIVE_INFINITY, // the data is immutable within a build
    /*
     * There is nothing to retry. `loadCv` fetches a locale through a dynamic
     * `import()`, and the browser remembers a failed import: the module map
     * holds null, and every subsequent attempt fails instantly without sending
     * a single request. The default three retries with a growing backoff buy
     * seven seconds of skeleton for four consecutive failures — seven seconds
     * of showing the visitor a lie. The real retry is a page reload, and that
     * is what the button in CvError does.
     */
    retry: false
  })
