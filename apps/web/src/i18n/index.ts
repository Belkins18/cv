import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './en'
import { uk } from './uk'

/**
 * The dictionary keys are flat and contain dots (`section.experience`), so
 * `keySeparator` is switched off: otherwise i18next would look for a nested
 * `section` object and return the key itself instead of a translation.
 *
 * `useSuspense: false` because the resources are already in the bundle, there is
 * nothing to wait for, and Suspense would demand a boundary around every
 * component in the tests.
 */
void i18next.use(initReactI18next).init({
  resources: { en: { translation: en }, uk: { translation: uk } },
  lng: 'en',
  fallbackLng: 'en',
  keySeparator: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false }
})

/** Typing for `t`: a typo in a key becomes a compile error. */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    keySeparator: false
    resources: { translation: typeof en }
  }
}

export { i18next }
