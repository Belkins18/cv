# Git Flow Instruction

## Назначение

Этот документ описывает правила работы с Git, ветками, коммитами и Pull Request.

ИИ-агент обязан читать этот файл перед:

- созданием новой ветки;
- изменением Git Flow;
- подготовкой Pull Request;
- merge в `development` или `master`;
- изменением правил коммитов;
- изменением release-процесса.

## Основные ветки

В проекте используются две главные ветки:

```txt
master
development
```

### `master`

`master` — стабильная production-ветка.

Правила:

- прямые коммиты запрещены;
- прямые пуши запрещены;
- код попадает в `master` из `development` — через Pull Request либо merge,
  который выполняет владелец проекта лично;
- ИИ-агент в `master` не мерджит и не пушит без явного разрешения на конкретное
  действие;
- merge в `master` выполняется только после проверки стабильности проекта.

### `development`

`development` — основная ветка разработки и интеграции.

Правила:

- прямые коммиты запрещены: код приходит из рабочей ветки;
- новые задачи создаются только от актуальной `development`;
- код попадает в `development` через merge из `feat/*` или `fix/*`;
- **Pull Request не обязателен.** Проект разрабатывается в одиночку, ревьюить
  свой же PR перед собственным merge — ритуал без пользы. Merge выполняется
  локально с `--no-ff`, чтобы в истории осталось видно границу задачи;
- пуш в `development` разрешён;
- перед merge проверки обязательны: `pnpm format`, `pnpm lint`,
  `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm guard`.

Правило про Pull Request смягчено 2026-09-21. Оно вернётся, если над проектом
начнёт работать кто-то ещё: ревью чужого кода — это уже не ритуал.

## Рабочие ветки

Для новых задач используются отдельные ветки.

### Feature-ветки

Для новых фич:

```txt
feat/short-feature-name
```

Примеры:

```txt
feat/auth-page
feat/dashboard-filters
feat/user-settings
```

### Fix-ветки

Для исправления багов:

```txt
fix/short-bug-name
```

Примеры:

```txt
fix/button-click
fix/form-validation
fix/header-layout
```

### Другие допустимые префиксы

При необходимости можно использовать:

```txt
docs/update-readme
refactor/page-layout
chore/update-deps
test/add-form-tests
```

Но для обычных задач предпочтительны:

```txt
feat/*
fix/*
```

## Старт новой задачи

Перед началом новой задачи агент должен:

1. Проверить текущую ветку.
2. Убедиться, что работа начинается от `development`.
3. Обновить `development`, если подключён remote.
4. Создать новую ветку под задачу.

Пример:

```bash
git checkout development
git pull origin development
git checkout -b feat/example-feature
```

Если remote ещё не настроен или проект находится только локально, агент должен сообщить об этом и работать с локальной веткой.

## Локальный MVP-режим

Если проект находится на стадии локального MVP и удалённый репозиторий ещё не подключён:

- агент всё равно должен работать через feature/fix-ветки;
- Pull Request может быть заменён локальным review через diff;
- merge в `development` выполняется только после локальных проверок;
- прямые коммиты в `master` всё равно запрещены.

## Коммиты

В проекте используется стиль Conventional Commits.

Формат:

```txt
type(scope): message
```

Минимально допустимый формат:

```txt
type: message
```

Примеры:

```txt
feat: add auth page
fix: correct button click handler
docs: update project instructions
chore: configure lint-staged
refactor: simplify dashboard layout
```

Допустимые типы:

```txt
feat
fix
docs
chore
style
refactor
ci
test
revert
perf
```

## Правила сообщений коммитов

Сообщение коммита должно:

- быть на английском языке;
- быть коротким и понятным;
- описывать фактическое изменение;
- не содержать расплывчатых фраз вроде `update`, `fix stuff`, `changes`.

Плохо:

```txt
update
fix
some changes
```

Хорошо:

```txt
feat: add notification settings page
fix: handle empty form state
docs: move code quality setup to instructions
```

## Завершение задачи: merge в development

После завершения задачи ветка `feat/*` или `fix/*` вливается в `development`
локально, командой `git merge --no-ff`. Pull Request не обязателен — почему,
написано в разделе про `development` выше.

Перед merge агент обязан проверить:

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm guard
```

Если какая-то команда отсутствует, агент должен явно сообщить об этом.
Утверждать, что проверка прошла, можно только если она запускалась.

Отчёт о задаче заменяет описание PR и содержит:

- краткое описание задачи;
- список основных изменений;
- результаты проверок;
- риски или ограничения;
- что проверить вручную.

Если Pull Request всё-таки создаётся — например, чтобы сохранить обсуждение, —
его описание строится по тому же шаблону:

```md
## Summary

- Added ...
- Updated ...
- Fixed ...

## Validation

- `pnpm format`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm guard`

## Notes

- ...
```

## Pull Request из development в master

PR из `development` в `master` создаётся только когда:

- весь функционал протестирован;
- сборка проходит успешно;
- нет известных блокирующих багов;
- проект готов к релизу.

Перед merge в `master` обязательно выполнить:

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm build
pnpm guard
```

Если есть тесты:

```bash
pnpm test
```

## Запреты

ИИ-агенту запрещено:

- пушить напрямую в `master`;
- мерджить в `master` без явного разрешения;
- делать merge без проверок;
- удалять ветки без явного разрешения;
- менять Git Flow без явного разрешения;
- переписывать историю Git через `rebase`, `reset --hard`, `force push` без явного разрешения;
- создавать бессмысленные коммиты с сообщениями вроде `update` или `fix`.

## Что агент должен сообщить после Git-задачи

После работы с Git агент должен кратко сообщить:

- текущую ветку;
- от какой ветки она создана;
- какие коммиты сделаны;
- какие проверки запущены;
- сведена ли ветка в `development`;
- есть ли нерешённые конфликты или риски.
