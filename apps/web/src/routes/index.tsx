import { createRoute } from '@tanstack/react-router'
import { HomePage } from '@/pages/HomePage'
import { rootRoute } from './root'
import { searchSchema } from './search'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: searchSchema,
  component: HomePage
})
