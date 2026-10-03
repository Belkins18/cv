import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  BINARY_FILE,
  FORBIDDEN_CONTENT,
  FORBIDDEN_IN_RESUME
} from '../../../tools/repo-guard/patterns'

/*
 * Второй рубеж приватности — внутри сборки, а не рядом с ней.
 *
 * `pnpm guard` читает `git ls-files` и видит исходники. Здесь читается то, что
 * реально уедет на хостинг: собранный `dist`, где строки уже вкомпилированы
 * в чанки, перемешаны с кодом библиотек и переименованы минификатором. Утечка,
 * попавшая в бандл из непроиндексированного файла, из зависимости или через
 * `import.meta.env`, гварду не видна, а сайту — видна.
 *
 * Раньше этот скан жил отдельной e2e-спекой, то есть гонял его только CI.
 * Netlify собирает и публикует параллельно, не дожидаясь зелёного CI, — утечка
 * успела бы уехать, а CI покраснел бы уже после. Шлюз PDF сделан механизмом
 * внутри сборки (`copy-pdf.ts`), и у второго рубежа того же класса нет причин
 * быть защищённым иначе. Теперь это `postbuild`: сборка либо чистая, либо её нет.
 *
 * Словарь не копируется, а импортируется из `tools/repo-guard/patterns.ts`:
 * копия, которая мягче оригинала, — не дубликат, а дыра.
 */

const distDir = fileURLToPath(new URL('../dist/', import.meta.url))

const walk = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = join(dir, entry.name)
      return entry.isDirectory() ? walk(full) : Promise.resolve([full])
    })
  )
  return nested.flat()
}

/*
 * Полярность как у гварда: отсекаются бинарники, сканируется всё остальное.
 * Белый список расширений пропустил бы незнакомый файл молча, а молчаливый
 * пропуск здесь неотличим от чистого прогона. Текстовый слой PDF при этом
 * не остаётся непроверенным — его читает `copy-pdf.ts` до того, как файл
 * вообще попадает в `public/`.
 */
const files = (await walk(distDir)).filter((file) => !BINARY_FILE.test(file))

if (files.length < 3) {
  // Страховка от молчаливой самонейтрализации: пустой dist сделал бы проверку
  // ниже зелёной, ничего не проверив.
  throw new Error(
    `в ${distDir} нечего сканировать (${files.length} файлов) — сборка пуста или каталог не тот`
  )
}

const dictionary = new Map([...FORBIDDEN_CONTENT, ...FORBIDDEN_IN_RESUME])
const contents = await Promise.all(
  files.map(async (file) => [file, await readFile(file, 'utf8')] as const)
)

// Метки и пути, но не совпадения: напечатать найденное — значит выписать
// приватные данные в лог сборки, который на Netlify и в CI хранится.
const found = [...dictionary].flatMap(([label, pattern]) => {
  const hits = contents
    .filter(([, text]) => pattern.test(text))
    .map(([file]) => relative(distDir, file))
  return hits.length === 0 ? [] : [`${label} → ${hits.join(', ')}`]
})

if (found.length > 0) {
  throw new Error(
    `в собранном сайте найдено приватное:\n  ${found.join('\n  ')}\n` +
      'Сайт публичный — эта сборка уехала бы на хостинг как есть.'
  )
}

console.log(`dist просканирован: ${files.length} файлов, чисто`)
