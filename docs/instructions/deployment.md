# Deployment and CI

## What is built from what

There are two artifacts, and both grow out of the same `@cv/data` dataset:

- `out/cv-nikolay-belibov.pdf` — produced by `@cv/print#pdf` (Playwright prints
  the `apps/print` page to a PDF with a real text layer);
- `apps/web/dist` — the site.

The site **depends** on the PDF: `turbo.json` declares
`"@cv/web#build": { "dependsOn": ["^build", "@cv/print#pdf"] }`, and the
`prebuild` of `@cv/web` moves the finished file into `apps/web/public/`, from
where Vite puts it into `dist/`. Without that wiring the Download PDF button
leads to a 404 while the build stays green — which is why the copy step **fails**
when the PDF is missing instead of warning.

A consequence: `pnpm build` requires an installed Chromium.

```bash
pnpm --filter @cv/web exec playwright install chromium
```

## The PDF never enters Git

`out/` and `apps/web/public/*.pdf` are gitignored. The PDF is rebuilt every time;
the repository does not hold it.

## The phone number: a gate, not a reminder

`CV_PHONE` is set **only** when building the PDF that goes out with a job
application. Neither Netlify nor GitHub Actions knows that variable, and neither
should: the site is public.

But an instruction you are supposed not to break is weaker than a check you
cannot break. So `apps/web/scripts/copy-pdf.ts` — the only path from `out/` into
the publish directory — **extracts the text layer** of the very file that is
about to go to the site and compares it against the whole
`tools/repo-guard/patterns.ts` dictionary. On a match it fails the build and
copies nothing; it also removes the old copy from `public/` before the check, so
a refusal never leaves a file from an earlier build on disk.

What is checked is the file, not an environment variable, and that matters: the
variable may be unset while a tainted PDF sits in `out/` from an earlier build.
The failure messages print only the pattern labels, never the matches: build logs
on Netlify and in GitHub Actions are stored and readable.

The two artifacts are separated by command:

```bash
CV_PHONE="+380…" pnpm pdf    # the PDF for applications, stays in out/
pnpm build                    # the site; with CV_PHONE set it fails, and that is correct
```

## Netlify

`netlify.toml` holds both the build command and the publish directory — nothing
needs configuring in the Netlify UI beyond picking the repository.

The build installs Chromium and runs `turbo run build --filter=@cv/web...`. The
filter picks up the `@cv/print#pdf` step as well: an explicit `package#task`
dependency outranks the filter.

**If Netlify cannot bring up Chromium** (missing system libraries — `--with-deps`
is unavailable in their container), the fallback from the task 21 plan is to build
the PDF in GitHub Actions, publish it as an artifact, and have Netlify build the
site against the ready file. Switch only once Netlify actually fails, not
pre-emptively.

## Two gates inside the build

A check that runs beside the build protects worse than a check built into it:
Netlify builds and publishes in parallel and does not wait for a green CI. So both
privacy gates live in the `@cv/web` scripts and fail the build:

| step        | script                 | what it reads                                     |
| ----------- | ---------------------- | ------------------------------------------------- |
| `prebuild`  | `scripts/copy-pdf.ts`  | the PDF's text layer before it moves to `public/` |
| `postbuild` | `scripts/scan-dist.ts` | the whole built `dist`, binaries aside            |

Both import the dictionary from `tools/repo-guard/patterns.ts` rather than
copying it: a copy that is softer than the original is not a duplicate, it is a
hole. Both print pattern labels and file names, never the matches: build logs are
stored.

## CI

`.github/workflows/ci.yml` runs on a `push` to `master`/`development` and on every
pull request, and it runs eight gates — exactly the local ones, in the same order:

```
pnpm guard → pnpm lint → pnpm format:check → pnpm typecheck
→ pnpm test → pnpm build → pnpm pdf → pnpm --filter @cv/web e2e
```

The guard goes first: running the rest on top of a leak makes no sense.

`pnpm pdf` is a line of its own, and not for symmetry: the 19 ATS checks over the
built PDF live in `apps/print/test/pdf.test.ts` under their own
`vitest.pdf.config.ts`, and `pnpm test` does **not** pick them up. Without that
line, "a PDF with no text layer or longer than two pages" would be the one class
of failure from Review Focus with no automated gate — while CI publishes that
unchecked PDF as an artifact and Netlify puts it behind the Download button.

The built PDF is uploaded as a build artifact, and so are the traces of failed
e2e runs.

pnpm is installed through corepack from the `packageManager` field, so its version
is not duplicated in the workflow or in `netlify.toml` beyond what is necessary.

## e2e

```bash
pnpm --filter @cv/web build   # e2e runs against the built site
pnpm --filter @cv/web e2e
```

Playwright starts `vite preview` itself. The suite checks behaviour: the scenarios
in `e2e/cv.spec.ts` and the PDF link in `e2e/pdf-link.spec.ts`. The bundle scan has
been taken out of it — it moved into `postbuild`, because a privacy gate belongs
on the path to publication, not beside it.
