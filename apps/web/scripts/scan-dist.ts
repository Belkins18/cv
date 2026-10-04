import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  BINARY_FILE,
  FORBIDDEN_CONTENT,
  FORBIDDEN_IN_RESUME
} from '../../../tools/repo-guard/patterns'

/*
 * The second line of privacy defence, inside the build rather than beside it.
 *
 * `pnpm guard` reads `git ls-files` and therefore sees sources. What is read
 * here is what actually ships: the built `dist`, where strings are already
 * compiled into chunks, mixed with library code and renamed by the minifier.
 * A leak that reaches the bundle from an unindexed file, from a dependency or
 * through `import.meta.env` is invisible to the guard — and perfectly visible
 * on the site.
 *
 * This scan used to live in a separate e2e spec, which meant only CI ever ran
 * it. Netlify builds and publishes in parallel without waiting for a green CI,
 * so a leak would have shipped and CI would have gone red afterwards. The PDF
 * gate was made a mechanism inside the build (`copy-pdf.ts`), and a second line
 * of the same class has no reason to be protected any differently. It is now a
 * `postbuild`: either the build is clean or there is no build.
 *
 * The dictionary is imported from `tools/repo-guard/patterns.ts` rather than
 * copied: a copy that is softer than the original is not a duplicate, it is a hole.
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
 * The same polarity as the guard: binaries are filtered out, everything else is
 * scanned. An allowlist of extensions would skip an unfamiliar file in silence,
 * and a silent skip here is indistinguishable from a clean run. The PDF's text
 * layer is not left unchecked either — `copy-pdf.ts` reads it before the file
 * ever lands in `public/`.
 */
const files = (await walk(distDir)).filter((file) => !BINARY_FILE.test(file))

if (files.length < 3) {
  // Insurance against silent self-neutralization: an empty dist would make the
  // check below green without checking anything.
  throw new Error(
    `nothing to scan in ${distDir} (${files.length} files) — the build is empty or this is the wrong directory`
  )
}

const dictionary = new Map([...FORBIDDEN_CONTENT, ...FORBIDDEN_IN_RESUME])
const contents = await Promise.all(
  files.map(async (file) => [file, await readFile(file, 'utf8')] as const)
)

// Labels and paths, but never the matches: printing what was found would mean
// writing private data into a build log that Netlify and CI keep.
const found = [...dictionary].flatMap(([label, pattern]) => {
  const hits = contents
    .filter(([, text]) => pattern.test(text))
    .map(([file]) => relative(distDir, file))
  return hits.length === 0 ? [] : [`${label} → ${hits.join(', ')}`]
})

if (found.length > 0) {
  throw new Error(
    `private data found in the built site:\n  ${found.join('\n  ')}\n` +
      'The site is public — this build would have gone to the host as is.'
  )
}

console.log(`dist scanned: ${files.length} files, clean`)
