# AGENTS.md

## Язык и стиль работы

- Инструкции, пояснения и проектная документация пишутся на русском языке.
- Имена файлов, директорий, компонентов, переменных, функций, типов и веток Git пишутся на английском языке.
- ИИ-агент отвечает кратко, по делу и без выдуманных фактов.
- Если не хватает критичных данных, агент явно указывает предположение и выбирает минимальный безопасный вариант.
- Если задача затрагивает архитектуру, зависимости, Git Flow, tooling или данные резюме, агент сначала читает релевантные инструкции.

## Что это за репозиторий

Монорепо резюме. Один датасет — два артефакта: ATS-пригодный PDF (EN) и
двуязычный сайт-резюме. Репозиторий **публичный**.

- `packages/config` — пресеты TypeScript и ESLint (`@cv/config`);
- `packages/cv-data` — единственный источник правды: zod-схемы, реестр технологий,
  вычисляемые длительности, генерация локализованных JSON-чанков (`@cv/data`);
- `packages/ui` — обезличенные примитивы интерфейса (`@cv/ui`);
- `apps/print` — Vite-приложение с print-CSS, из него Playwright печатает PDF (`@cv/print`);
- `apps/web` — сайт с фильтром по стеку в search-параметрах (`@cv/web`).

Границы: `cv-data` не импортирует React. `ui` не знает слова «резюме».
`print` зависит от `cv-data`, но **не** от `ui`. `web` склеивает всё.

## Приватность

Репозиторий публичный, поэтому в нём не существует:

- личного телефона — он попадает в PDF только через переменную окружения `CV_PHONE`;
- рабочей почты работодателя; контактная почта — `belibov.nikolay@gmail.com`;
- внутренних метрик работодателя;
- скриншотов, спек и дизайн-документов.

Это проверяет `pnpm guard` (`tools/repo-guard/privacy.test.ts`). Гвард запускается
перед каждым merge. Ослаблять его правила нельзя.

## Базовый стек

- **Vite + React + TypeScript**, TypeScript в режиме `strict` плюс
  `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`.
- Монорепо — **pnpm workspaces + Turborepo**.
- Данные — zod. Роутинг и загрузка — TanStack Router + Query. Стили — Tailwind v4.
- Тесты — Vitest, e2e — Playwright. Деплой — Netlify, CI — GitHub Actions.
- Node — `>=22`.

## Менеджер пакетов

Менеджер зависимостей — **pnpm**, версия зафиксирована в поле `packageManager`
и ставится через `corepack`. Это осознанное расхождение с правилом EasyFop
«только Bun»: монорепо здесь требование задачи, а pnpm workspaces + Turborepo —
самая узнаваемая связка под него.

- Production-зависимость пакета: `pnpm add --filter <pkg> <name>`.
- Dev-зависимость пакета: `pnpm add -D --filter <pkg> <name>`.
- В корень — только `pnpm add -w -D <name>` и только то, что нужно всему репозиторию.
- `pnpm-lock.yaml` обязан быть зафиксирован в Git.
- `npm`, `yarn` и `bun` запрещены, если пользователь явно не разрешил их.
- Перед добавлением зависимости агент проверяет, нельзя ли решить задачу уже установленным стеком.
- Новые production-зависимости нельзя добавлять без явного разрешения.

## Команды

Все команды запускаются из корня, это `turbo run <task>` по всему workspace:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm guard      # тест приватности публичного репозитория
pnpm pdf        # сборка PDF
pnpm format
```

Один пакет: `pnpm --filter @cv/data test`.

## Linked Instructions

ИИ-агент обязан читать дополнительные инструкции перед соответствующими задачами:

- Git Flow, ветки, коммиты или PR-процесс: `docs/instructions/git-flow.md`
- Husky, Commitlint, Prettier, ESLint, lint-staged, React-компоненты и правила качества: `docs/instructions/code-quality.md`
- Тесты, test setup или test scripts: `docs/instructions/testing.md`

Если linked instruction-файл отсутствует, агент не выдумывает его содержимое,
а сообщает об отсутствии и предлагает создать минимальную версию.

## Конвенции кода

- **Только arrow functions.** `export const Name = () => {}`; `function Name() {}` запрещён.
- **Только named export.** Default export для компонентов не используется.
- **Component-as-a-Folder.** Компонент — это папка: `Chip/Chip.tsx` + `Chip/index.ts`.
  Тест компонента лежит в его же папке. `types.ts` появляется, только когда типы пропсов разрослись.
- **Сгенерированный код адаптируется под эти правила.** Если `shadcn` CLI положил
  `components/ui/button.tsx` с `function Button()` — файл переносится в
  `components/UI/Button/Button.tsx` и переписывается. Документация библиотеки правилам проекта не указ.
- **`cn` живёт в `utils/classNames/classNames.ts`**, не в `lib/utils.ts`.
- **Алиас `@` обязателен в приложениях** (`apps/web`, `apps/print`) и указывает на их `src`.
  Внутри `packages/*` алиаса нет — там короткие относительные импорты.
- **Стилизация — только Tailwind + CSS-переменные.** SCSS, CSS-in-JS и CSS Modules не используются.
  Цвета берутся из токенов, не хардкодятся в компонентах.
- **shadcn-компоненты добавляются поштучно**, весь набор сразу не ставится.
- **Тема — три режима:** `type ThemeMode = "system" | "light" | "dark"`, по умолчанию `system`,
  выбор пользователя сохраняется в `localStorage`.

## Главные запреты

ИИ-агенту запрещено без явного разрешения:

- менять стек проекта;
- добавлять production-зависимости;
- менять `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `turbo.json`,
  `tsconfig*.json`, ESLint, Prettier, Husky или Commitlint конфиги вне рамок задачи;
- ослаблять правила `tools/repo-guard/` или коммитить приватные данные;
- переписывать архитектуру или делать большие рефакторинги внутри маленьких задач;
- удалять существующий код без объяснения причины;
- менять Git Flow;
- создавать глобальные абстракции без необходимости;
- использовать `npm`, `yarn` или `bun` для управления зависимостями;
- игнорировать ошибки TypeScript, ESLint, Prettier, тестов или сборки;
- отключать правила линтера, форматтера или TypeScript ради быстрого прохождения проверки;
- изменять файлы вне рамок задачи.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
