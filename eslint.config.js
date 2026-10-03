import js from '@eslint/js'
import tseslint from 'typescript-eslint'

/**
 * Корневой конфиг покрывает только инструментарий репозитория: `tools/**` и
 * конфиги в корне. У пакетов и приложений свои конфиги поверх `@cv/config/eslint`
 * — общие правила живут там, а не здесь, иначе одно правило разъедется на копии.
 */
export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.turbo/**',
      'coverage/**',
      'packages/**',
      'apps/**'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended
)
