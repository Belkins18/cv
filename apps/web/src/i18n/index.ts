import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './en'
import { uk } from './uk'

/**
 * Ключи словаря плоские и содержат точки (`section.experience`), поэтому
 * `keySeparator` выключен: иначе i18next искал бы вложенный объект `section`
 * и возвращал бы сам ключ вместо перевода.
 *
 * `useSuspense: false` — ресурсы лежат в бандле, ждать нечего, а Suspense
 * потребовал бы границу вокруг каждого компонента в тестах.
 */
void i18next.use(initReactI18next).init({
  resources: { en: { translation: en }, uk: { translation: uk } },
  lng: 'en',
  fallbackLng: 'en',
  keySeparator: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false }
})

/** Типизация `t`: опечатка в ключе становится ошибкой компиляции. */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    keySeparator: false
    resources: { translation: typeof en }
  }
}

export { i18next }
