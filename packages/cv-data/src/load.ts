import { resolvedCvSchema, type ResolvedCv } from './schema'
import type { Locale } from './types'

export class CvDataError extends Error {
  constructor(
    readonly locale: Locale,
    cause: unknown
  ) {
    super(`failed to load the CV data for locale "${locale}"`, {
      cause
    })
    this.name = 'CvDataError'
  }
}

export type LocaleImporter = () => Promise<{ default: unknown }>

/**
 * Two statically written dynamic imports instead of one template string: that is
 * the only form from which the bundler cuts a separate chunk per language.
 */
const importers: Record<Locale, LocaleImporter> = {
  en: () => import('../locales/en.json'),
  uk: () => import('../locales/uk.json')
}

export const loadCvFrom = async (
  locale: Locale,
  importer: LocaleImporter
): Promise<ResolvedCv> => {
  try {
    const module = await importer()
    return resolvedCvSchema.parse(module.default)
  } catch (cause) {
    throw new CvDataError(locale, cause)
  }
}

export const loadCv = (locale: Locale): Promise<ResolvedCv> =>
  loadCvFrom(locale, importers[locale])
