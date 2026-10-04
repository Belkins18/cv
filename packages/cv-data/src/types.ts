export const LOCALES = ['en', 'uk'] as const
export type Locale = (typeof LOCALES)[number]

/**
 * Localization is baked into the type: a string is required to exist in both
 * languages. Forgetting a translation is physically impossible — tsc refuses.
 */
export type Localized = { readonly [L in Locale]: string }

/** The level of detail is a data field, not two different datasets. */
export type Detail = 'full' | 'compact' | 'hidden'

export type IsoMonth = string
