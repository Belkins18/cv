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
  // Четыре внутренних числа WireX, названные в Global Constraints:
  // 85.4M→10.7M токенов, 449K→150K контекста, 55851→1122 строки, 66 схем.
  // Публикуется только личный результат — «~8× дешевле», «пиковый контекст на две
  // трети меньше», «тысячи строк → читаемая дельта». Здесь числа пишутся целиком:
  // файл гварда лежит в SELF, это его словарь.
  [
    'внутренние числа WireX: стоимость миграции в токенах',
    /\b85[.,]\s?4\s?M\b|\b10[.,]\s?7\s?M\b/i
  ],
  ['внутренние числа WireX: пиковый контекст', /\b449\s?K\b|\b150\s?K\b/i],
  // 1122 голой цифрой ловить нельзя — она встречается в хэшах и версиях, поэтому
  // привязана к слову про строки. В дизайн-документе число пишется и как «55 851».
  [
    'внутренние числа WireX: размер дельты схем',
    /\b55\s?851\b|\b1122[\s\-—]*(стро|рядк|line)/i
  ],
  // То же и с 66: осмысленно только рядом со словом «схемы».
  ['внутренние числа WireX: количество схем', /\b66\s+(схем|schema)/i],
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
