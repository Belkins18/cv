import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    /*
     * A belt on top of the real fix, not instead of it: the compiler now runs
     * once in beforeAll (see test/strict.test.ts), but that run is still
     * `pnpm exec tsc` in a separate process, and on a loaded CI runner it is
     * slower than on a laptop. The default ten seconds per hook is too thin a
     * margin for a gate nobody may be taught to ignore.
     */
    hookTimeout: 60_000
  }
})
