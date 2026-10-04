import js from '@eslint/js'
import tseslint from 'typescript-eslint'

/**
 * The root config covers the repository tooling only: `tools/**` and the configs
 * at the root. Packages and apps carry their own configs on top of
 * `@cv/config/eslint` — the shared rules live there, not here, or one rule would
 * drift into copies.
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
