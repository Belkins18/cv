import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'
import {
  BINARY_FILE,
  FORBIDDEN_CONTENT,
  FORBIDDEN_IN_RESUME
} from '../../../tools/repo-guard/patterns'

/*
 * Второй рубеж приватности, Review Focus №2.
 *
 * `pnpm guard` читает `git ls-files` — он видит исходники. Здесь читается то,
 * что реально уедет на хостинг: собранный `dist`, где строки уже вкомпилированы
 * в чанки, перемешаны с кодом библиотек и переименованы минификатором. Утечка,
 * попавшая в бандл из непроиндексированного файла, из зависимости или через
 * `import.meta.env`, гварду не видна, а сайту — видна.
 *
 * Словарь не копируется: он импортируется из `tools/repo-guard/patterns.ts`.
 * Копия, которая мягче оригинала, — не дубликат, а дыра; этот урок в репозитории
 * уже оплачен. Попутно спека не содержит ни одной запрещённой строки сама —
 * иначе её поймал бы гвард, который её же и сканирует.
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
 * Белый список расширений пропустил бы незнакомый файл молча — а молчаливый
 * пропуск здесь неотличим от чистого прогона.
 */
const scannable = async (): Promise<string[]> =>
  (await walk(distDir)).filter((file) => !BINARY_FILE.test(file))

test.describe('собранный сайт', () => {
  test('сканируется непустой набор файлов', async () => {
    const files = await scannable()
    expect(
      files.length,
      'dist пуст или не собран — остальные проверки стали бы ложно-зелёными'
    ).toBeGreaterThan(2)
  })

  /*
   * Собранный сайт — это одновременно и публикуемые файлы, и текст резюме,
   * поэтому оба словаря складываются. Одна запись лежит в обоих списках —
   * `Map` схлопывает её по метке, иначе Playwright валит весь прогон на
   * одинаковых заголовках тестов. Называть эту запись здесь по имени нельзя:
   * гвард сканирует и эту спеку тоже, и упоминание сделало бы её утечкой.
   */
  const dictionary = new Map([...FORBIDDEN_CONTENT, ...FORBIDDEN_IN_RESUME])

  for (const [label, pattern] of dictionary) {
    test(`не содержит: ${label}`, async () => {
      const files = await scannable()
      const hits: string[] = []
      for (const file of files) {
        if (pattern.test(await readFile(file, 'utf8'))) {
          hits.push(relative(distDir, file))
        }
      }
      expect(hits).toEqual([])
    })
  }
})
