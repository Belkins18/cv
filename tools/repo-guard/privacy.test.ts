import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/** Файлы, которые git реально отслеживает. Именно они уедут в публичный репозиторий. */
const tracked = (): string[] =>
  execFileSync('git', ['ls-files'], { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)

/** Пути, которых в публичном репозитории быть не должно (дизайн §10). */
const FORBIDDEN_PATHS: Array<[label: string, pattern: RegExp]> = [
  ['node_modules', /(^|\/)node_modules\//],
  ['сгенерированные локали', /^packages\/cv-data\/locales\//],
  ['приватные спеки', /docs\/superpowers\/specs\//],
  ['скриншоты', /\.(png|jpe?g)$/i]
]

/** Строки, которых не должно быть ни в одном отслеживаемом текстовом файле. */
const FORBIDDEN_CONTENT: Array<[label: string, pattern: RegExp]> = [
  ['личный телефон', /\+?380\d{9}/],
  ['рабочая почта работодателя', /@wirex-systems\.com/i],
  ['внутренние метрики WireX', /85\.4M|449K|10\.7M/],
  ['слово cybersecurity', /cyber ?security/i]
]

const TEXT = /\.(ts|tsx|js|jsx|json|md|css|html|ya?ml)$/

/**
 * Файлы, которые сканер не сканирует.
 * Собственный исходник сканера обязан содержать запрещённые строки — это его
 * словарь. Без исключения гвард всегда падает на самом себе, и запрещённое
 * пришлось бы прятать за склейкой строк, то есть делать словарь нечитаемым.
 * `pnpm-lock.yaml` — машинный файл с хэшами, в нём совпадения ложные.
 */
const SELF = ['tools/repo-guard/privacy.test.ts', 'pnpm-lock.yaml']

describe('приватность публичного репозитория', () => {
  const files = tracked()

  it.each(FORBIDDEN_PATHS)('не отслеживает %s', (_label, pattern) => {
    expect(files.filter((f) => pattern.test(f))).toEqual([])
  })

  it.each(FORBIDDEN_CONTENT)(
    'ни один файл не содержит: %s',
    (_label, pattern) => {
      const hits = files
        .filter((f) => TEXT.test(f) && !SELF.includes(f))
        .filter((f) => pattern.test(readFileSync(f, 'utf8')))
      expect(hits).toEqual([])
    }
  )
})
