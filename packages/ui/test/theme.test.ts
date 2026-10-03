// @vitest-environment node
// Тест гоняет Tailwind CLI через node:child_process: в jsdom import.meta.url
// не file-URL, и fileURLToPath на нём падает.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { beforeAll, describe, expect, it } from 'vitest'

/**
 * theme.css — единственный файл пакета, который не проверяется юнит-тестами
 * компонентов: @theme обрабатывает Tailwind, а не TypeScript. Опечатка в
 * директиве тихо выключила бы весь набор токенов, поэтому прогоняем файл
 * через настоящий компилятор Tailwind и смотрим, что получилось.
 */
const packageRoot = fileURLToPath(new URL('..', import.meta.url))

let compiled = ''

beforeAll(() => {
  const dir = mkdtempSync(join(tmpdir(), 'cv-ui-theme-'))
  const input = join(dir, 'input.css')
  const output = join(dir, 'output.css')

  // Классы, которыми пользуются примитивы пакета: Tailwind генерирует утилиту
  // только под найденный кандидат, поэтому список подаём явно через @source inline.
  writeFileSync(
    input,
    [
      `@import '${join(packageRoot, 'src/theme.css')}';`,
      `@source inline('{bg-surface,bg-surface-raised,border-border,text-ink,text-ink-muted,text-accent,bg-accent,text-accent-ink,outline-accent,font-mono,font-sans}');`
    ].join('\n')
  )

  execFileSync(
    'pnpm',
    ['exec', 'tailwindcss', '--input', input, '--output', output],
    { cwd: packageRoot, stdio: 'pipe' }
  )

  compiled = readFileSync(output, 'utf8')
}, 60_000)

describe('theme.css', () => {
  it('компилируется Tailwind и отдаёт токены темы как переменные', () => {
    expect(compiled).toContain('--color-surface:')
    expect(compiled).toContain('--color-ink-muted:')
    expect(compiled).toContain('--color-accent-ink:')
    expect(compiled).toContain('--font-mono:')
  })

  it('порождает утилиты на именах токенов — цвета в компонентах не хардкод', () => {
    expect(compiled).toContain('.bg-surface-raised')
    expect(compiled).toContain('.text-ink-muted')
    expect(compiled).toContain('.border-border')
    expect(compiled).toContain('.outline-accent')
  })

  it('держит светлую тему на тех же именах переменных', () => {
    expect(compiled).toContain("[data-theme='light']")
    expect(compiled).toContain('prefers-color-scheme')
  })
})
