import { execFileSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const typecheckFixture = (): { code: number; output: string } => {
  try {
    const output = execFileSync(
      'pnpm',
      ['exec', 'tsc', '--noEmit', '-p', 'test/fixture/tsconfig.json'],
      { encoding: 'utf8', cwd: new URL('..', import.meta.url).pathname }
    )
    return { code: 0, output }
  } catch (error) {
    const e = error as { status: number; stdout: string }
    return { code: e.status, output: e.stdout }
  }
}

describe('пресет tsconfig/base', () => {
  it('отвергает доступ по индексу без проверки', () => {
    const { code, output } = typecheckFixture()
    expect(code).not.toBe(0)
    expect(output).toContain("possibly 'undefined'")
  })

  it('отвергает явный undefined в опциональном поле', () => {
    expect(typecheckFixture().output).toContain('exactOptionalPropertyTypes')
  })
})
