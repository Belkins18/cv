import js from '@eslint/js'
// The plugin ships no types, and this preset is compiled with checkJs. The
// directive will remind us to drop it once types appear: TypeScript reports an
// unnecessary ts-expect-error as an error.
// @ts-expect-error -- eslint-plugin-jsx-a11y ships no declarations
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

/** Base flat config: every package extends it with its own block. */
export default tseslint.config(
  { ignores: ['dist/**', 'locales/**', '.turbo/**', '**/test/fixture/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  /*
   * The hook rules are not decoration. Without them neither `rules-of-hooks` nor
   * `exhaustive-deps` ran at all in an app full of effects, subscriptions and
   * useCallback: a conditional hook and an effect with a forgotten dependency
   * both compiled in silence.
   *
   * We take `configs.flat[…]`, not `configs[…]`: in the identically named
   * non-flat variant of 7.1.1 the `plugins` field is an array, and ESLint 9
   * exits with code 2 on it. The set is the full one, React Compiler rules
   * included: it is clean on this code, and the cheapest thing to forbid is
   * whatever has not been written yet.
   */
  reactHooks.configs.flat['recommended-latest'],
  /*
   * The site claims accessibility (role=checkbox on chips, aria-label on
   * text-less buttons, a native dialog), and a claim needs something to check
   * it. The set is clean on the current code — verified by planting breakage:
   * an img without alt, a div with onClick and an a without href all go red.
   */
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      // The preset ships this as warn, and `eslint .` inside packages runs
      // without --max-warnings=0: a warning here would mean "not checked".
      'react-hooks/exhaustive-deps': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSNonNullExpression',
          message:
            'The ! operator hides a real undefined — check the value explicitly.'
        }
      ]
    }
  }
)
