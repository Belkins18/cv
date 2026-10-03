import { copyFile, mkdir, readFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { extractText, getDocumentProxy } from 'unpdf'
import {
  FORBIDDEN_CONTENT,
  FORBIDDEN_IN_RESUME
} from '../../../tools/repo-guard/patterns'

/*
 * PDF в репозиторий не коммитится: он собирается из того же датасета и живёт
 * в `out/` (в .gitignore). Сайту он нужен как статический файл, поэтому перед
 * каждой сборкой кладётся в `public/`, откуда Vite переносит его в `dist/`.
 * Порядок держит turbo: `@cv/web#build` зависит от `@cv/print#pdf`.
 *
 * Этот файл — единственный шлюз между PDF и публичным хостингом, и он обязан
 * быть механизмом, а не предупреждением. Инструкция, которую нужно не нарушить,
 * слабее проверки, которую нарушить нельзя: `out/cv-nikolay-belibov.pdf` вполне
 * может оказаться тем PDF, который собирался для отклика — с телефоном, по
 * заданному CV_PHONE или просто оставшийся от прошлой сборки. Поэтому
 * проверяется не переменная окружения, а текстовый слой того самого файла,
 * который сейчас поедет на сайт.
 */

const FILE = 'cv-nikolay-belibov.pdf'
const source = fileURLToPath(new URL(`../../../out/${FILE}`, import.meta.url))
const targetDir = fileURLToPath(new URL('../public/', import.meta.url))

/*
 * Собранный бандл сканирует e2e (`e2e/bundle.spec.ts`), но PDF он пропускает
 * как бинарник. Текстовый слой этого файла — единственное, что на публичном
 * сайте остаётся непросканированным, поэтому словарь берётся целиком: и то,
 * чего не должно быть в репозитории, и то, чего не должно быть в тексте резюме.
 */
const dictionary = new Map([...FORBIDDEN_CONTENT, ...FORBIDDEN_IN_RESUME])

const target = `${targetDir}${FILE}`

/*
 * Старая копия сносится ДО проверки, а не после неё. Иначе отказ оставлял бы
 * в каталоге публикации файл от прошлой — возможно, заражённой — сборки:
 * проверка сказала «нельзя», а на диске по-прежнему лежит «можно».
 */
await rm(target, { force: true })

const pdf = await readFile(source).catch(() => {
  /*
   * Падать, а не предупреждать: без файла сборка зелёная, а кнопка на живом
   * сайте ведёт в 404 — ровно та поломка, ради которой написан pdf-link.spec.ts.
   */
  throw new Error(
    `не найден ${source}\n` +
      'Сначала собери PDF: `pnpm --filter @cv/print pdf` ' +
      '(или просто `pnpm build` — turbo сделает это сам).'
  )
})

const document = await getDocumentProxy(new Uint8Array(pdf))
const { text } = await extractText(document, { mergePages: true })

// Метки, а не совпадения: напечатать найденное — значит выписать телефон в лог
// сборки, который на Netlify и в GitHub Actions хранится и доступен.
const found = [...dictionary]
  .filter(([, pattern]) => pattern.test(text))
  .map(([label]) => label)

if (found.length > 0) {
  throw new Error(
    `${FILE} не годится для публикации, найдено: ${found.join('; ')}.\n` +
      'Сайт публичный — этот файл уехал бы на хостинг как есть.\n' +
      'Похоже, в out/ лежит PDF, собранный для отклика. Он собирается отдельно\n' +
      'и на сайт не кладётся; перед сборкой сайта CV_PHONE не должен быть задан\n' +
      'ни в окружении, ни в .env:\n' +
      '  CV_PHONE="+380…" pnpm --filter @cv/print pdf   # файл для отклика\n' +
      '  pnpm build                                      # сайт, без телефона'
  )
}

await mkdir(targetDir, { recursive: true })
await copyFile(source, target)
console.log(`${FILE} перенесён в public/`)
