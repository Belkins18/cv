import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider
} from '@tanstack/react-router'
import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { searchSchema } from '@/routes/search'

export type RenderWithRouterOptions = {
  /** The initial URL — how a test feeds in search params, junk ones included. */
  path?: string
}

/**
 * TanStack Router 1.170 throws "Cannot read properties of null" from useSearch
 * outside a RouterProvider — even with `strict: false`. The plan allowed for
 * either behaviour; the installed version insists on a real router, so the
 * component is mounted into a route carrying the same `searchSchema` as
 * production, on top of a memory history.
 */
export const renderWithRouter = (
  ui: ReactNode,
  { path = '/' }: RenderWithRouterOptions = {}
) => {
  const rootRoute = createRootRoute()
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    validateSearch: searchSchema,
    component: () => ui
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: [path] })
  })
  // retry: false, or the failure test would wait out three retries instead of
  // observing one failure.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  return {
    router,
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    )
  }
}
