import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'

const repoRoot = fileURLToPath(new URL('../../', import.meta.url))

/**
 * The only place in the repository that decides whether a phone number is set.
 *
 * There is exactly one name on the outside, `CV_PHONE`: that is how it is
 * written in the constitution, in CLAUDE.md, in AGENTS.md and in the test over
 * the built PDF. While there were two sources — an environment variable for the
 * test and a `VITE_`-prefixed one for the build — the command straight out of
 * the documentation produced a PDF without a phone number, and 15 of the 16
 * checks stayed green. So the layout and the check both read the value from
 * here instead of each resolving its own.
 *
 * An empty string means "not set": the phone block is not rendered, and the test
 * expects it to be absent. The number itself exists nowhere in the repository,
 * in any form (design doc §10).
 */
export const resolveCvPhone = (mode = 'production'): string => {
  const fromShell = process.env['CV_PHONE']
  if (fromShell !== undefined && fromShell !== '') return fromShell
  // .env lives at the repository root, not in the app folder: the documented
  // commands are run from the root. The file itself is gitignored; only
  // .env.example is tracked.
  return loadEnv(mode, repoRoot, 'CV_')['CV_PHONE'] ?? ''
}
