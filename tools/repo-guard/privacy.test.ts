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
 * The files the scanner does not scan.
 * A dictionary of forbidden strings is required to contain forbidden strings —
 * that is its job. Without the exception the guard would always fail on itself,
 * and the dictionary would have to hide behind string concatenation, which is to
 * say become unreadable. `pnpm-lock.yaml` is a machine-written file full of
 * hashes, where every match is a false one.
 *
 * Neither file holds any resume data, so neither creates a blind spot.
 */
const SELF = ['tools/repo-guard/patterns.ts', 'pnpm-lock.yaml']

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
