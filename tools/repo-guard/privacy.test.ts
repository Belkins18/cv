import { execFileSync } from 'node:child_process'
import { readFileSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  BINARY_FILE,
  FORBIDDEN_CONTENT,
  FORBIDDEN_IN_RESUME,
  FORBIDDEN_PATHS
} from './patterns'

/** The files git actually tracks. These are the ones that go to a public repository. */
const tracked = (): string[] =>
  execFileSync('git', ['ls-files'], {
    encoding: 'utf8',
    // The default maxBuffer is 1 MB, and on a large index git fails with ENOBUFS.
    // The guard then goes red for a technical reason rather than a leak it found,
    // and telling the two apart in the output is hard, so the headroom is taken
    // up front.
    maxBuffer: 64 * 1024 * 1024
  })
    .split('\n')
    .filter(Boolean)

/**
 * The file the scanner does not scan: `pnpm-lock.yaml`, machine-written and full
 * of hashes, where every match is a false one.
 *
 * The dictionary itself used to sit here too, on the reasoning that a file of
 * forbidden strings is required to contain them. It is not: every pattern is
 * written so that its own source text does not match it, and the test below
 * holds that property rather than trusting it.
 *
 * The old comment claimed the exemption created no blind spot, because the file
 * held no resume data. The blind spot was never about resume data: what the
 * exemption hid was the real phone number, written out in a comment inside the
 * dictionary — the one string this guard exists to find, invisible to it for as
 * long as the exemption stood.
 */
const SELF = ['pnpm-lock.yaml']

/** The dataset files: exactly what the resume text is assembled from. */
const DATASET = /^packages\/cv-data\/src\/data\/[^/]+\.ts$/

const isScannable = (file: string): boolean =>
  !SELF.includes(file) && !BINARY_FILE.test(file) && statSync(file).isFile()

const read = (file: string): string => readFileSync(file, 'utf8')

describe('the privacy of a public repository', () => {
  const files = tracked()
  const scannable = files.filter(isScannable)

  it('scans a non-empty set of files', () => {
    // Insurance against silent self-neutralization: if the filters ever cut
    // everything away, the remaining tests go green having checked nothing.
    expect(scannable.length).toBeGreaterThan(20)
  })

  it('scans the dictionary of forbidden strings itself', () => {
    expect(scannable).toContain('tools/repo-guard/patterns.ts')
  })

  it.each(FORBIDDEN_PATHS)('tracks no %s', (_label, pattern) => {
    expect(files.filter((f) => pattern.test(f))).toEqual([])
  })

  it.each(FORBIDDEN_CONTENT)(
    'finds no file containing: %s',
    (_label, pattern) => {
      expect(scannable.filter((f) => pattern.test(read(f)))).toEqual([])
    }
  )

  describe('the resume text', () => {
    const dataset = scannable.filter(
      (f) => DATASET.test(f) && !f.endsWith('.test.ts')
    )

    it('finds the dataset', () => {
      expect(dataset.length).toBeGreaterThan(0)
    })

    it.each(FORBIDDEN_IN_RESUME)(
      'finds nothing in the dataset matching: %s',
      (_label, pattern) => {
        expect(dataset.filter((f) => pattern.test(read(f)))).toEqual([])
      }
    )
  })
})
