import { execFileSync } from 'node:child_process'
import { readFileSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  BINARY_FILE,
  FORBIDDEN_CONTENT,
  FORBIDDEN_IN_RESUME,
  FORBIDDEN_PATHS
} from './patterns'

/** Файлы, которые git реально отслеживает. Именно они уедут в публичный репозиторий. */
const tracked = (): string[] =>
  execFileSync('git', ['ls-files'], {
    encoding: 'utf8',
    // Дефолтный maxBuffer — 1 МБ, и на большом индексе git падает с ENOBUFS.
    // Гвард при этом краснеет по технической причине, а не по найденной утечке:
    // отличить одно от другого в выводе трудно, поэтому запас берётся сразу.
    maxBuffer: 64 * 1024 * 1024
  })
    .split('\n')
    .filter(Boolean)

/**
 * Файлы, которые сканер не сканирует.
 * Словарь запрещённого обязан содержать запрещённые строки — это его работа.
 * Без исключения гвард всегда падает на самом себе, и словарь пришлось бы
 * прятать за склейкой фрагментов, то есть делать нечитаемым.
 * `pnpm-lock.yaml` — машинный файл с хэшами, в нём совпадения ложные.
 *
 * Данных резюме ни в одном из этих файлов нет, поэтому слепого пятна они не создают.
 */
const SELF = ['tools/repo-guard/patterns.ts', 'pnpm-lock.yaml']

/** Файлы датасета — ровно то, из чего собирается текст резюме. */
const DATASET = /^packages\/cv-data\/src\/data\/[^/]+\.ts$/

const isScannable = (file: string): boolean =>
  !SELF.includes(file) && !BINARY_FILE.test(file) && statSync(file).isFile()

const read = (file: string): string => readFileSync(file, 'utf8')

describe('приватность публичного репозитория', () => {
  const files = tracked()
  const scannable = files.filter(isScannable)

  it('сканирует непустой набор файлов', () => {
    // Страховка от молчаливой самонейтрализации: если фильтры однажды отсекут
    // всё, остальные тесты станут зелёными, ничего не проверив.
    expect(scannable.length).toBeGreaterThan(20)
  })

  it.each(FORBIDDEN_PATHS)('не отслеживает %s', (_label, pattern) => {
    expect(files.filter((f) => pattern.test(f))).toEqual([])
  })

  it.each(FORBIDDEN_CONTENT)(
    'ни один файл не содержит: %s',
    (_label, pattern) => {
      expect(scannable.filter((f) => pattern.test(read(f)))).toEqual([])
    }
  )

  describe('текст резюме', () => {
    const dataset = scannable.filter(
      (f) => DATASET.test(f) && !f.endsWith('.test.ts')
    )

    it('датасет найден', () => {
      expect(dataset.length).toBeGreaterThan(0)
    })

    it.each(FORBIDDEN_IN_RESUME)(
      'датасет не содержит: %s',
      (_label, pattern) => {
        expect(dataset.filter((f) => pattern.test(read(f)))).toEqual([])
      }
    )
  })
})
