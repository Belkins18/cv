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
  /** Начальный URL — им в тест заводятся search-параметры, в том числе мусорные. */
  path?: string
}

/**
 * TanStack Router 1.170 бросает «Cannot read properties of null» на useSearch
 * вне RouterProvider — даже с `strict: false`. План допускал оба поведения;
 * живая версия требует настоящий роутер, поэтому компонент монтируется в
 * маршрут с той же `searchSchema`, что и боевой, поверх memory-истории.
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
  // retry: false — иначе тест отказа ждёт три повтора вместо одного отказа.
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
