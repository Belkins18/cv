import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { beforeAll, describe, expect, it } from 'vitest'

/*
 * The fixture is compiled ONCE per file, not once per test.
 *
 * Each `it` used to spawn its own `pnpm exec tsc` — two full processes for one
 * and the same compilation. Under turbo's nine parallel tasks the second one
 * missed the default five-second budget, and `pnpm test` flaked roughly once
 * every five or six cold runs. A flaky gate is worse than a missing one: it
 * trains people to look past red — and this gate now runs in CI too.
 *
 * `fileURLToPath`, not `.pathname`: the latter does not decode percent-encoding,
 * so a directory name with a space in it produced a broken cwd.
 */
const packageRoot = fileURLToPath(new URL('..', import.meta.url))

let code = 0
let output = ''

beforeAll(() => {
  try {
    output = execFileSync(
      'pnpm',
      ['exec', 'tsc', '--noEmit', '-p', 'test/fixture/tsconfig.json'],
      { encoding: 'utf8', cwd: packageRoot }
    )
    code = 0
  } catch (error) {
    const failure = error as { status: number; stdout: string }
    code = failure.status
    output = failure.stdout
  }
})

describe('the tsconfig/base preset', () => {
  it('rejects an unchecked index access', () => {
    expect(code).not.toBe(0)
    expect(output).toContain("possibly 'undefined'")
  })

  it('rejects an explicit undefined in an optional field', () => {
    expect(output).toContain('exactOptionalPropertyTypes')
  })
})
