# Деплой и CI

## Что из чего собирается

Артефакта два, и оба растут из одного датасета `@cv/data`:

- `out/cv-nikolay-belibov.pdf` — делает `@cv/print#pdf` (Playwright печатает
  страницу `apps/print` в PDF с настоящим текстовым слоем);
- `apps/web/dist` — сайт.

Сайт **зависит** от PDF: `turbo.json` объявляет
`"@cv/web#build": { "dependsOn": ["^build", "@cv/print#pdf"] }`, а `prebuild`
пакета `@cv/web` переносит готовый файл в `apps/web/public/`, откуда Vite
кладёт его в `dist/`. Без этой связки кнопка Download PDF ведёт в 404,
и сборка при этом остаётся зелёной — поэтому шаг копирования **падает**,
когда PDF не найден, а не предупреждает.

Следствие: `pnpm build` требует установленного Chromium.

```bash
pnpm --filter @cv/web exec playwright install chromium
```

## PDF в Git не попадает

`out/` и `apps/web/public/*.pdf` — в `.gitignore`. PDF каждый раз собирается
заново, в репозитории его нет.

## Телефон

`CV_PHONE` задаётся **только** локально, когда собирается тот PDF, который
уходит в отклик. Ни Netlify, ни GitHub Actions эту переменную не знают и знать
не должны: сайт публичный. Шаг копирования говорит вслух, если собрал PDF
с номером — такой файл на хостинг не едет.

## Netlify

`netlify.toml` держит и команду сборки, и каталог публикации — в интерфейсе
Netlify ничего настраивать не нужно, кроме выбора репозитория.

Сборка ставит Chromium и запускает `turbo run build --filter=@cv/web...`.
Фильтр подхватывает и шаг `@cv/print#pdf`: явная зависимость `package#task`
сильнее фильтра.

**Если Netlify не сможет поднять Chromium** (не хватит системных библиотек —
`--with-deps` в их контейнере недоступен), запасной план из плана задачи 21:
собирать PDF в GitHub Actions, публиковать артефактом, а в Netlify собирать
сайт с уже готовым файлом. Переключаться только когда Netlify реально падает,
а не превентивно.

## CI

`.github/workflows/ci.yml` гоняет на `push` в `master`/`development` и на
каждый pull request те же гейты, что и локально, в том же порядке:

```
pnpm guard → pnpm lint → pnpm typecheck → pnpm test → pnpm build → e2e
```

Гвард идёт первым: гонять остальное над утечкой смысла нет.
Собранный PDF уезжает в артефакты сборки, трейсы упавших e2e — тоже.

pnpm ставится через corepack из поля `packageManager`, поэтому его версия
не продублирована ни в workflow, ни в `netlify.toml` сверх необходимого.

## e2e

```bash
pnpm --filter @cv/web build   # e2e гоняются по собранному сайту
pnpm --filter @cv/web e2e
```

Playwright поднимает `vite preview` сам. Два рубежа в одном наборе:
сценарии в `e2e/cv.spec.ts` и `e2e/pdf-link.spec.ts` — и скан собранного
бандла в `e2e/bundle.spec.ts`, который читает словарь запрещённого прямо из
`tools/repo-guard/patterns.ts`. Словарь не копируется: копия, которая мягче
оригинала, — это не дубликат, а дыра.
