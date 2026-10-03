export const LOCALES = ['en', 'uk'] as const
export type Locale = (typeof LOCALES)[number]

/**
 * Локализация зашита в тип: строка обязана существовать на обоих языках.
 * Забыть перевод физически нельзя — tsc не соберётся.
 */
export type Localized = { readonly [L in Locale]: string }

/** Уровень детализации — поле данных, а не два разных датасета. */
export type Detail = 'full' | 'compact' | 'hidden'

export type IsoMonth = string
