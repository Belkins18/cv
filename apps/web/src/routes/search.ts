import { z } from 'zod'

/**
 * `.catch(undefined)` на каждом поле: битый параметр обязан деградировать до
 * значения по умолчанию, а не ронять маршрут. Ссылку правят руками и ломают
 * мессенджеры, и `?tech=react,drogon,,REACT&lang=fr` должен открыть страницу
 * с валидной частью фильтра. Сам список технологий чистит parseTechParam —
 * здесь проверяется только то, что это вообще строка.
 */
export const searchSchema = z.object({
  tech: z.string().optional().catch(undefined),
  lang: z.enum(['en', 'uk']).optional().catch(undefined),
  theme: z.enum(['system', 'light', 'dark']).optional().catch(undefined)
})

export type CvSearch = z.infer<typeof searchSchema>
