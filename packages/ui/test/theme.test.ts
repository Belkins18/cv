// @vitest-environment node
// The test drives the Tailwind CLI through node:child_process: under jsdom
// import.meta.url is not a file URL, and fileURLToPath throws on it.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { beforeAll, describe, expect, it } from 'vitest'

/**
 * theme.css is the one file in this package that the component unit tests never
 * cover: @theme is handled by Tailwind, not by TypeScript. A typo in the
 * directive would silently switch the whole token set off, so we run the file
 * through the real Tailwind compiler and look at what came out.
 */
const packageRoot = fileURLToPath(new URL('..', import.meta.url))

let compiled = ''

beforeAll(() => {
  const dir = mkdtempSync(join(tmpdir(), 'cv-ui-theme-'))
  const input = join(dir, 'input.css')
  const output = join(dir, 'output.css')

  // The classes the package primitives use: Tailwind only emits a utility for a
  // candidate it has actually seen, so we hand it the list via @source inline.
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
  it('compiles under Tailwind and exposes the theme tokens as variables', () => {
    expect(compiled).toContain('--color-surface:')
    expect(compiled).toContain('--color-ink-muted:')
    expect(compiled).toContain('--color-accent-ink:')
    expect(compiled).toContain('--font-mono:')
  })

  it('emits utilities named after the tokens, so components never hardcode a color', () => {
    expect(compiled).toContain('.bg-surface-raised')
    expect(compiled).toContain('.text-ink-muted')
    expect(compiled).toContain('.border-border')
    expect(compiled).toContain('.outline-accent')
  })

  it('keeps the light theme on the same variable names', () => {
    expect(compiled).toContain("[data-theme='light']")
    expect(compiled).toContain('prefers-color-scheme')
  })
})
