import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { beforeAll, describe, expect, it } from 'vitest'

/*
 * Фикстура компилируется ОДИН раз на файл, а не по разу на тест.
 *
 * Раньше каждый `it` поднимал свой `pnpm exec tsc` — два полных процесса ради
 * одной и той же компиляции. Под девятью параллельными задачами turbo второй
 * не укладывался в дефолтные пять секунд, и `pnpm test` мигал примерно раз
 * на пять-шесть холодных прогонов. Мигающий гейт хуже отсутствующего:
 * он приучает не смотреть на красное — а этот гейт теперь ещё и в CI.
 *
 * `fileURLToPath`, а не `.pathname`: последний не декодирует percent-encoding,
 * и на пути с пробелом в имени каталога cwd получался битым.
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

describe('пресет tsconfig/base', () => {
  it('отвергает доступ по индексу без проверки', () => {
    expect(code).not.toBe(0)
    expect(output).toContain("possibly 'undefined'")
  })

  it('отвергает явный undefined в опциональном поле', () => {
    expect(output).toContain('exactOptionalPropertyTypes')
  })
})
