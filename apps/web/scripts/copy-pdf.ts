import { copyFile, mkdir, readFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { extractText, getDocumentProxy } from 'unpdf'
import {
  FORBIDDEN_CONTENT,
  FORBIDDEN_IN_RESUME
} from '../../../tools/repo-guard/patterns'

/*
 * The PDF is never committed: it is built from the same dataset and lives in
 * `out/` (gitignored). The site needs it as a static file, so before every build
 * it is copied into `public/`, from where Vite moves it into `dist/`. The order
 * is held by turbo: `@cv/web#build` depends on `@cv/print#pdf`.
 *
 * This file is the only gate between the PDF and public hosting, and it has to
 * be a mechanism rather than a warning. An instruction you are supposed not to
 * break is weaker than a check you cannot break: `out/cv-nikolay-belibov.pdf`
 * may well be the PDF built for an application — with a phone number in it,
 * because CV_PHONE was set, or simply left over from an earlier build. So what
 * gets checked is not an environment variable but the text layer of the very
 * file that is about to go to the site.
 */

const FILE = 'cv-nikolay-belibov.pdf'
const source = fileURLToPath(new URL(`../../../out/${FILE}`, import.meta.url))
const targetDir = fileURLToPath(new URL('../public/', import.meta.url))

/*
 * The built bundle is scanned by e2e (`e2e/bundle.spec.ts`), but it skips the
 * PDF as a binary. This file's text layer is the one thing on the public site
 * that would otherwise stay unscanned, so the whole dictionary applies here:
 * both what must not be in the repository and what must not be in the resume.
 */
const dictionary = new Map([...FORBIDDEN_CONTENT, ...FORBIDDEN_IN_RESUME])

const target = `${targetDir}${FILE}`

/*
 * The old copy is removed BEFORE the check, not after it. Otherwise a refusal
 * would leave the publish directory holding a file from an earlier — possibly
 * tainted — build: the check says "no", and what is on disk still says "yes".
 */
await rm(target, { force: true })

const pdf = await readFile(source).catch(() => {
  /*
   * Throw, do not warn: without the file the build stays green while the button
   * on the live site leads to a 404 — exactly the breakage pdf-link.spec.ts
   * was written for.
   */
  throw new Error(
    `${source} not found\n` +
      'Build the PDF first: `pnpm --filter @cv/print pdf` ' +
      '(or just `pnpm build` — turbo will do it for you).'
  )
})

const document = await getDocumentProxy(new Uint8Array(pdf))
const { text } = await extractText(document, { mergePages: true })

// Labels, not matches: printing what was found would mean writing the phone
// number into a build log that Netlify and GitHub Actions keep and serve.
const found = [...dictionary]
  .filter(([, pattern]) => pattern.test(text))
  .map(([label]) => label)

if (found.length > 0) {
  throw new Error(
    `${FILE} is not fit to publish, found: ${found.join('; ')}.\n` +
      'The site is public — this file would have gone to the host as is.\n' +
      'It looks like out/ holds the PDF built for a job application. That one is\n' +
      'built separately and never goes to the site; before building the site\n' +
      'CV_PHONE must be unset both in the environment and in .env:\n' +
      '  CV_PHONE="+380…" pnpm --filter @cv/print pdf   # the file for applications\n' +
      '  pnpm build                                      # the site, without a phone number'
  )
}

await mkdir(targetDir, { recursive: true })
await copyFile(source, target)
console.log(`${FILE} copied into public/`)
