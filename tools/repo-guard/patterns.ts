/**
 * The single dictionary of what this repository forbids.
 *
 * The same patterns used to be copied into four files, and they had already
 * drifted apart: the guard and the PDF check matched the phone number as
 * `/\+?380\d{9}/`, while the dataset and layout tests used `/380\d{9}/`. A copy
 * that is softer than the original is not a duplicate, it is a hole. So there is
 * one source, and this file is listed in the guard's `SELF`: it is required to
 * contain the forbidden strings — that is its job — and it holds no resume data.
 *
 * The dictionary is derived from the project rules on privacy, not the other way
 * round. A green run on its own does not prove there is no leak.
 */

/**
 * The personal phone number. The project rules say it "does not exist in the
 * repository in any form", so separators inside the number are allowed for: a
 * form written with spaces or hyphens between the groups is the same number as
 * the unspaced one, and those used to slip past. The digit boundaries on both
 * sides keep the pattern from matching inside longer numbers.
 *
 * No example is spelled out, and none is needed: the pattern matches any
 * Ukrainian number, never one in particular. Writing a real one here would put
 * into the repository exactly what this line exists to forbid.
 */
export const PHONE = /(?<!\d)\+?\s?380(?:[\s\-.()]?\d){9}(?!\d)/

/** The employer's work email: never used in a public repository. */
export const WORK_EMAIL = /@wirex-systems\.com/i

/**
 * Forbidden in every tracked text file.
 * The four internal WireX figures named in the Global Constraints: the token
 * cost, the peak context, the schema-delta size and the number of schemas. Only
 * the personal outcome is published — "~8x cheaper", "peak context down by two
 * thirds", "thousands of lines turned into a readable delta".
 */
export const FORBIDDEN_CONTENT: ReadonlyArray<
  readonly [label: string, pattern: RegExp]
> = [
  ['the personal phone number', PHONE],
  ['the employer work email', WORK_EMAIL],
  [
    'internal WireX figures: the migration cost in tokens',
    /\b85[.,]\s?4\s?M\b|\b10[.,]\s?7\s?M\b/i
  ],
  ['internal WireX figures: the peak context', /\b449\s?K\b|\b150\s?K\b/i],
  // The bare four-digit line count cannot be matched on its own — it turns up in
  // hashes and version numbers — so it is anchored to a word meaning "line". The
  // design document also writes the larger figure with a space inside it.
  [
    'internal WireX figures: the size of the schema delta',
    /\b55\s?851\b|\b1122[\s\-—]*(стро|рядк|line)/i
  ],
  // Same with the schema count: it only means anything next to the word "schema".
  ['internal WireX figures: the number of schemas', /\b66\s+(схем|schema)/i],
  ['the security-category term for this product domain', /cyber ?security/i]
]

/**
 * Forbidden in the resume text — in the dataset and in the built PDF, but not
 * across the whole repository. The documentation is allowed to name these limits
 * out loud ("the title carries no Senior"), otherwise the guard would fail on the
 * project's own rules. The content of the resume is another matter: these words
 * never reach it (sources §4).
 */
export const FORBIDDEN_IN_RESUME: ReadonlyArray<
  readonly [label: string, pattern: RegExp]
> = [
  ['the security-category term for this product domain', /cyber ?security/i],
  ['BSAFE named as an employer', /BSAFE/i],
  ['a title carrying Senior', /\bSenior\b/i],
  // Ne2ition is called a network-protocol analysis platform and nothing else.
  // A bare `NDR` cannot be matched: in a minified bundle that is a plausible
  // variable name, so the abbreviation is anchored to the product name nearby.
  [
    'Ne2ition spelled out as NDR',
    /Ne2ition[\s\S]{0,80}\bNDR\b|\bNDR\b[\s\S]{0,80}Ne2ition/i
  ]
  // The phone number is deliberately absent here: in the built PDF it appears
  // legitimately whenever CV_PHONE is set. The repository is guarded against the
  // number by FORBIDDEN_CONTENT, and the "exactly when it is set" condition has
  // its own test in apps/print/test/pdf.test.ts.
]

/** Paths that must not exist in a public repository (design doc §10). */
export const FORBIDDEN_PATHS: ReadonlyArray<
  readonly [label: string, pattern: RegExp]
> = [
  ['node_modules', /(^|\/)node_modules\//],
  ['generated locales', /^packages\/cv-data\/locales\//],
  ['private specs', /docs\/superpowers\/specs\//],
  // Screenshots from linkedin/, easy-fop/, vibr/ and the work folders. The list of
  // formats is deliberately wide: it used to catch only png and jpeg, while webp,
  // gif and heic went straight through.
  [
    'screenshots and images',
    /\.(png|jpe?g|gif|webp|avif|bmp|tiff?|heic|heif|psd|sketch|fig|xcf)$/i
  ]
]

/**
 * Extensions whose contents there is no point in scanning.
 *
 * The polarity matters: this used to be an allowlist of text extensions, and
 * anything outside it was never scanned at all — `.svg`, `.txt`, `.env.example`,
 * `.husky/pre-commit` and every extension-less file. A denylist of binaries errs
 * on the safe side: an unfamiliar file gets read rather than skipped.
 */
export const BINARY_FILE =
  /\.(png|jpe?g|gif|webp|avif|bmp|tiff?|ico|heic|heif|pdf|zip|gz|tgz|br|7z|rar|woff2?|ttf|otf|eot|mp4|mov|webm|mp3|wav|ogg|wasm|node|dylib|so|dll|exe|psd|sketch|fig)$/i
