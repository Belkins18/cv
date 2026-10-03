import { z } from 'zod'
import { TECH_IDS, type TechId } from './tech'

export const localizedSchema = z.object({
  en: z.string().min(1),
  uk: z.string().min(1)
})

export const isoMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'ожидается формат YYYY-MM')

export const periodSchema = z
  .object({ start: isoMonthSchema, end: isoMonthSchema.nullable() })
  .refine(
    (p) => p.end === null || p.end >= p.start,
    'период заканчивается раньше, чем начинается'
  )

export const techIdSchema = z.enum(TECH_IDS as [TechId, ...TechId[]])
export const detailSchema = z.enum(['full', 'compact', 'hidden'])

const httpsUrl = z.string().regex(/^https:\/\/\S+$/, 'ожидается https-ссылка')

/**
 * Одна форма документа, две инстанциации: с Localized-объектами (исходный датасет)
 * и с простыми строками (датасет, спроецированный на локаль). Разойтись они не могут.
 */
export const makeCvSchema = <T extends z.ZodType<unknown>>(text: T) =>
  z.object({
    profile: z.object({ name: z.string().min(1), title: text, summary: text }),
    contacts: z.object({
      // z.email() — форма zod 4; z.string().email() помечен deprecated.
      email: z.email(),
      telegram: z.string().min(1),
      linkedin: httpsUrl,
      github: httpsUrl,
      location: text,
      phone: z.string().optional()
    }),
    roles: z.array(
      z.object({
        id: z.string().min(1),
        company: z.string().min(1).optional(),
        companyUrl: httpsUrl.optional(),
        location: text.optional(),
        title: text,
        period: periodSchema,
        detail: detailSchema,
        tech: z.array(techIdSchema),
        bullets: z.array(text).default([])
      })
    ),
    projects: z.array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        url: httpsUrl,
        summary: text,
        tech: z.array(techIdSchema),
        bullets: z.array(text).default([])
      })
    ),
    certificates: z.array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        issuer: z.string().min(1),
        date: isoMonthSchema,
        credentialId: z.string().min(1),
        url: httpsUrl,
        summary: text
      })
    ),
    education: z.array(
      z.object({
        id: z.string().min(1),
        institution: text,
        degree: text,
        from: z.string().regex(/^\d{4}$/),
        to: z.string().regex(/^\d{4}$/)
      })
    ),
    languages: z.array(
      z.object({ id: z.string().min(1), name: text, level: text })
    )
  })

export const cvSchema = makeCvSchema(localizedSchema)
export const resolvedCvSchema = makeCvSchema(z.string().min(1))

export type Cv = z.infer<typeof cvSchema>
export type ResolvedCv = z.infer<typeof resolvedCvSchema>
export type Role = Cv['roles'][number]
export type ResolvedRole = ResolvedCv['roles'][number]
export type ResolvedProject = ResolvedCv['projects'][number]
