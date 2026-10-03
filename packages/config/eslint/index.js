import js from '@eslint/js'
import tseslint from 'typescript-eslint'

/** Базовый flat-config: его расширяет каждый пакет своим блоком. */
export default tseslint.config(
  { ignores: ['dist/**', 'locales/**', '.turbo/**', '**/test/fixture/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSNonNullExpression',
          message:
            'Оператор ! прячет реальный undefined — проверь значение явно.'
        }
      ]
    }
  }
)
