# Code Quality Instruction

## Назначение

Этот документ описывает настройку и правила работы с инструментами качества кода:

- Husky
- Commitlint
- Prettier
- Lint-Staged
- ESLint, если он используется в проекте

ИИ-агент обязан читать этот файл перед:

- изменением `package.json` scripts;
- настройкой Prettier;
- настройкой ESLint;
- настройкой Husky;
- настройкой Commitlint;
- настройкой lint-staged;
- изменением Git hooks;
- созданием или изменением React-компонентов;
- исправлением ошибок форматирования, линтинга или сборки.

## Монорепо

Проект — pnpm workspace под Turborepo. Из этого следует:

- инструменты качества (husky, commitlint, prettier, lint-staged) живут **только
  в корне**, в пакетах их конфигов нет — иначе одно правило разъезжается на пять копий;
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` в корне — это
  `turbo run <task>`: turbo сам обходит пакеты и соблюдает их порядок сборки;
- зависимость ставится в конкретный пакет: `pnpm add --filter @cv/web <name>`,
  dev-зависимость — `pnpm add -D --filter @cv/web <name>`. В корень — только `-w -D`
  и только то, что нужно всему репозиторию;
- `pnpm guard` — отдельный прогон теста приватности: репозиторий публичный.

## Общие правила

ИИ-агенту запрещено:

- отключать правила линтера без объяснения причины;
- удалять Husky hooks без явного разрешения;
- менять Commitlint-правила без явного разрешения;
- заменять pnpm на `npm`, `yarn` или `bun`;
- добавлять новые инструменты качества кода без объяснения причины;
- игнорировать ошибки TypeScript, ESLint, Prettier или сборки.

Если проверка падает, агент должен исправить причину ошибки, а не отключать правило.

## Используемые инструменты

### Husky

Husky используется для Git hooks.

Назначение:

- запуск проверок перед коммитом;
- проверка commit message;
- автоматическая синхронизация зависимостей после merge, если это настроено.

### Commitlint

Commitlint используется для проверки сообщений коммитов по Conventional Commits.

### Prettier

Prettier используется для автоформатирования кода и документации.

### Lint-Staged

Lint-Staged используется для запуска проверок только по изменённым файлам перед коммитом.

### ESLint

ESLint используется, если он уже настроен в проекте.

Агент не должен добавлять или переписывать ESLint-конфигурацию без отдельной задачи.

## Установка зависимостей

Установка Husky:

```bash
pnpm add -w -D husky
pnpm exec husky init
```

Установка Commitlint:

```bash
pnpm add -w -D @commitlint/config-conventional @commitlint/cli
```

Установка Lint-Staged и Prettier:

```bash
pnpm add -w -D lint-staged prettier
```

Если часть зависимостей уже установлена, агент не должен устанавливать их повторно без необходимости.

## package.json scripts

В `package.json` должен быть скрипт форматирования:

```json
{
  "scripts": {
    "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,css,scss,md,json}' --config ./.prettierrc"
  }
}
```

Если в проекте есть `README.md`, корневые `.md` файлы или документация вне `src`, можно расширить glob:

```json
{
  "scripts": {
    "format": "prettier --write '**/*.{js,jsx,ts,tsx,css,scss,md,json}' --config ./.prettierrc"
  }
}
```

Перед изменением scripts агент обязан проверить текущий `package.json`.

Если в проекте уже есть `lint`, `build`, `test` или другие scripts, агент должен использовать существующие команды.

## Prettier config

Рекомендуемый минимальный `.prettierrc`:

```json
{
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 80,
  "semi": false,
  "arrowParens": "always"
}
```

Если в проекте уже есть `.prettierrc`, агент не должен переписывать его без необходимости.

## Commitlint config

Файл в корне проекта:

```txt
commitlint.config.js
```

Содержимое:

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'chore',
        'style',
        'refactor',
        'ci',
        'test',
        'revert',
        'perf'
      ]
    ]
  }
}
```

## Husky commit-msg hook

Файл:

```txt
.husky/commit-msg
```

Содержимое:

```bash
pnpm exec commitlint --edit "$1"
```

Назначение:

- блокировать коммиты с неправильным сообщением;
- поддерживать Conventional Commits.

## Lint-Staged config

Можно хранить конфигурацию в `package.json`:

```json
{
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx}": ["eslint --max-warnings=0", "prettier --write"],
    "**/*.{html,json,css,scss,md,mdx}": ["prettier --write"]
  }
}
```

Или в отдельном файле:

```txt
.lintstagedrc
```

Содержимое `.lintstagedrc`:

```json
{
  "**/*.{js,jsx,ts,tsx}": ["eslint --max-warnings=0", "prettier --write"],
  "**/*.{html,json,css,scss,md,mdx}": ["prettier --write"]
}
```

Важно:

- если ESLint не настроен, агент не должен добавлять `eslint --max-warnings=0` в lint-staged без отдельной настройки ESLint;
- если ESLint уже настроен, нужно использовать существующую команду проекта;
- если команда падает, нужно исправлять причину, а не удалять команду.

## Husky pre-commit hook

Файл:

```txt
.husky/pre-commit
```

Содержимое:

```bash
pnpm exec lint-staged
```

Назначение:

- запускать форматирование и линтинг только по staged-файлам;
- не форматировать весь проект при каждом коммите.

## Husky post-merge hook

Файл:

```txt
.husky/post-merge
```

Содержимое:

```bash
pnpm install
```

Назначение:

- автоматически синхронизировать зависимости после merge или pull;
- снижать риск работы с устаревшим `pnpm-lock.yaml`.

Если проект маленький или хук мешает workflow, его можно не добавлять. Решение нужно зафиксировать в `docs/instructions/`.

## Проверки после изменения кода

После обычных изменений агент должен проверить доступные scripts в `package.json`.

Обычно используются:

```bash
pnpm format
pnpm lint
pnpm test
pnpm build
```

Если в проекте есть тесты:

```bash
pnpm test
```

Если какой-то команды нет в `package.json`, агент должен явно сказать:

```txt
Команда `pnpm lint` отсутствует в package.json, поэтому не запускалась.
```

Агент не должен утверждать, что проверка прошла, если она не запускалась.

## Проверки после изменения конфигурации качества кода

После изменения Husky, Commitlint, Prettier, ESLint или lint-staged агент должен:

1. Проверить `package.json`.
2. Проверить наличие нужных dev-зависимостей.
3. Проверить соответствующие config-файлы.
4. Запустить доступные проверки.
5. Сообщить результат.

Минимальный отчёт:

```md
## Validation

- `pnpm format` — passed
- `pnpm lint` — passed
- `pnpm build` — passed

## Notes

- ...
```

Если проверка упала:

```md
## Validation

- `pnpm lint` — failed

## Error

...

## Fix

...
```

## Правила создания React-компонентов

1. Все функциональные React-компоненты объявляются только через arrow functions:

```tsx
export const MyComponent = () => {
  return <div />
}
```

React-компоненты экспортируются через named export. Default export для
React-компонентов не используется, если в задаче нет отдельного исключения.

Function declarations для React-компонентов запрещены:

```tsx
function MyComponent() {
  return <div />
}
```

2. Используется подход **Component-as-a-Folder**.

Запрещено создавать одиночные файлы компонентов прямо в корне `components`,
`pages`, `features` или других feature-директорий.

Правильная структура компонента:

```txt
src/components/Button/
  Button.tsx
  index.ts
  Button.module.css
  types.ts
```

Для UI primitives используется та же логика Component-as-a-Folder:

```txt
src/components/UI/Button/
  Button.tsx
  index.ts
```

Запрещено:

```txt
src/components/ui/button.tsx
src/components/UI/Button.tsx
```

3. `index.ts` используется для чистого экспорта компонента наружу.

Пример:

```ts
export { Button } from './Button'
```

4. `types.ts` создаётся только если типы пропсов или связанные интерфейсы становятся объёмными.

5. Новый компонент должен следовать уже существующим стилевым и архитектурным паттернам проекта.

6. Generated UI components тоже обязаны следовать этим правилам. Если CLI или
   generator создаёт другой формат, результат нужно адаптировать перед
   завершением задачи.

## Правила для ИИ-агента

ИИ-агент должен:

- использовать pnpm для всех команд;
- проверять существующие scripts перед запуском;
- не добавлять новые инструменты качества без причины;
- не переписывать конфиги полностью, если можно внести точечное изменение;
- не отключать правила ради прохождения проверки;
- документировать нетривиальные решения в `docs/instructions/`.

## Что агент должен сообщить после задачи

После изменения code quality-настроек агент должен кратко сообщить:

- какие зависимости добавлены;
- какие config-файлы изменены;
- какие hooks созданы или изменены;
- какие проверки запущены;
- какие проблемы остались;
- нужно ли что-то сделать вручную.
