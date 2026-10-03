import js from '@eslint/js'
// Плагин не поставляет типов, а пресет компилируется с checkJs. Директива
// сама напомнит снять себя, когда типы появятся: ненужный ts-expect-error
// TypeScript считает ошибкой.
// @ts-expect-error -- у eslint-plugin-jsx-a11y нет деклараций
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

/** Базовый flat-config: его расширяет каждый пакет своим блоком. */
export default tseslint.config(
  { ignores: ['dist/**', 'locales/**', '.turbo/**', '**/test/fixture/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  /*
   * Правила хуков — не украшение. Без них `rules-of-hooks` и `exhaustive-deps`
   * не проверялись вовсе в приложении с эффектами, подписками и useCallback:
   * хук под условием и эффект с забытой зависимостью компилировались молча.
   *
   * Берётся `configs.flat[…]`, а не `configs[…]`: у одноимённого не-flat
   * варианта в 7.1.1 поле `plugins` — массив, и ESLint 9 падает на нём с кодом 2.
   * Набор полный, вместе с правилами React Compiler: на этом коде он чистый,
   * а дешевле всего запрещать то, чего ещё не написали.
   */
  reactHooks.configs.flat['recommended-latest'],
  /*
   * Сайт заявляет доступность (role=checkbox у чипов, aria-label у кнопок без
   * текста, нативный dialog), и заявление должно чем-то проверяться. На текущем
   * коде набор чистый — проверено подсадкой: img без alt, div с onClick
   * и a без href краснеют.
   */
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      // В пресете это warn, а `eslint .` в пакетах идёт без --max-warnings=0:
      // предупреждение здесь означало бы «не проверяется».
      'react-hooks/exhaustive-deps': 'error',
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
