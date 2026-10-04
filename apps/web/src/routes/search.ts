import { z } from 'zod'

/**
 * `.catch(undefined)` on every field: a broken parameter must degrade to the
 * default value rather than bring the route down. Links get hand-edited and
 * mangled by messengers, and `?tech=react,drogon,,REACT&lang=fr` has to open the
 * page with whatever part of the filter is valid. The technology list itself is
 * cleaned up by parseTechParam — all that is checked here is that it is a string
 * at all.
 */
export const searchSchema = z.object({
  tech: z.string().optional().catch(undefined),
  lang: z.enum(['en', 'uk']).optional().catch(undefined),
  theme: z.enum(['system', 'light', 'dark']).optional().catch(undefined)
})

export type CvSearch = z.infer<typeof searchSchema>
