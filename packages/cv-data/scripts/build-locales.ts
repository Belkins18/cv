import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { cv } from '../src/data/index'
import { project } from '../src/project'
import { LOCALES } from '../src/types'

const outDir = fileURLToPath(new URL('../locales/', import.meta.url))

await mkdir(outDir, { recursive: true })

for (const locale of LOCALES) {
  const file = `${outDir}${locale}.json`
  await writeFile(
    file,
    `${JSON.stringify(project(cv, locale), null, 2)}\n`,
    'utf8'
  )
  console.log(`написано ${file}`)
}
