import { access, copyFile, mkdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

/*
 * PDF в репозиторий не коммитится: он собирается из того же датасета и живёт
 * в `out/` (в .gitignore). Сайту он нужен как статический файл, поэтому перед
 * каждой сборкой кладётся в `public/`, откуда Vite переносит его в `dist/`.
 * Порядок держит turbo: `@cv/web#build` зависит от `@cv/print#pdf`.
 */

const FILE = 'cv-nikolay-belibov.pdf'
const source = fileURLToPath(new URL(`../../../out/${FILE}`, import.meta.url))
const targetDir = fileURLToPath(new URL('../public/', import.meta.url))

try {
  await access(source)
} catch {
  /*
   * Падать, а не предупреждать: без файла сборка зелёная, а кнопка на живом
   * сайте ведёт в 404 — ровно та поломка, ради которой написан pdf-link.spec.ts.
   */
  throw new Error(
    `не найден ${source}\n` +
      'Сначала собери PDF: `pnpm --filter @cv/print pdf` ' +
      '(или просто `pnpm build` — turbo сделает это сам).'
  )
}

await mkdir(targetDir, { recursive: true })
await copyFile(source, `${targetDir}${FILE}`)

/*
 * Телефон попадает в PDF только когда задан CV_PHONE (дизайн §10). Публичная
 * сборка — Netlify и CI — переменной не знает, и это правильно. А вот локальная
 * сборка с заполненным .env кладёт на сайт PDF с номером, и молчать об этом
 * нельзя. Проверяются оба источника, которые знает resolveCvPhone: окружение
 * и корневой .env — иначе предупреждение было бы ложно-спокойным.
 */
const phoneIsSet = async (): Promise<boolean> => {
  const fromShell = process.env['CV_PHONE']
  if (fromShell !== undefined && fromShell !== '') return true
  const envFile = fileURLToPath(new URL('../../../.env', import.meta.url))
  try {
    return /^\s*CV_PHONE\s*=\s*\S/m.test(await readFile(envFile, 'utf8'))
  } catch {
    return false // .env нет — значит, и телефона нет
  }
}

if (await phoneIsSet()) {
  console.warn(
    `${FILE}: собран с CV_PHONE — этот PDF для отклика, не для публикации.`
  )
}
console.log(`${FILE} перенесён в public/`)
