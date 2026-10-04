# Testing Instruction

## Purpose

This document describes how tests are set up and written in the `cv` monorepo:
the `packages/*` packages and the `apps/*` applications.

The AI agent must read this file before:

- setting up the test infrastructure;
- changing the test scripts;
- changing the Vitest configuration;
- writing new tests;
- fixing failing tests.

## The tools in use

The project builds on a basic testing layer:

- Vitest — the test runner for unit and component tests.
- jsdom — the DOM environment for React components.
- React Testing Library — testing the UI through user behaviour.
- `@testing-library/jest-dom` — extra DOM matchers.
- `@testing-library/user-event` — simulating user actions.

Coverage uses Vitest's built-in integration with the `v8` provider.

- Playwright — generating the PDF from `apps/print` and running the site's e2e checks.

Playwright is not "e2e for later" here, it is part of the build: the resume PDF is
printed by a headless browser, and `apps/print/test/pdf.test.ts` extracts the text
layer and the page count from the finished file. A resume that arrives as an image
reaches the recruiter as an empty card, so the check is mandatory.

## What gets tested first

First in line:

- the reusable components from `packages/ui` and `apps/*/src/features/`;
- the resume dataset and its schemas in `packages/cv-data`;
- utilities and pure functions, once there are any;
- user scenarios that carry meaningful business logic;
- regressions for bugs that have been found.

A test checks observable behaviour, not a component's internal implementation.

## Where tests live

Tests live next to the code they cover.

For a component:

```txt
src/components/Button/
  Button.tsx
  Button.test.tsx
  index.ts
```

Styling is Tailwind plus CSS variables; the project has no `*.module.css` files.

The exception is a test over a build artifact: those live in `<package>/test/` and
reach into `dist/` or `out/`, because what they check is not the source but what
came out of the build.

## Naming test files

The allowed formats:

```txt
*.test.ts
*.test.tsx
```

React components use `*.test.tsx`.

## Commands

This is a monorepo: each package's tests are started by `turbo run test` from the
root, not by a runner inside one folder. The root pnpm scripts are the only entry
point:

```bash
pnpm test                        # turbo run test across the workspace
pnpm --filter @cv/data test      # the tests of a single package
pnpm test -- --coverage
```

The usual run after a change:

```bash
pnpm format
pnpm test
pnpm build
```

If the change touches lint rules or TypeScript errors, add:

```bash
pnpm lint
```

## What the agent must not do

Without separate permission, the AI agent must not:

- add Cypress or any other e2e tool alongside Playwright;
- change the project's package manager — it is pnpm, and only pnpm;
- run the project scripts through `npm` or `yarn`;
- silence TypeScript, ESLint or failing tests to get the checks to pass;
- add a hard coverage threshold at the start of the project;
- rewrite the application architecture for the sake of the tests;
- test implementation details instead of user-visible behaviour.

## When tests are not needed

Tests may be skipped for:

- purely textual edits to the documentation;
- changes to comments;
- formatting that does not change behaviour;
- one-off technical files with no runtime logic.

If a code change ships without a test, the agent briefly explains why.

## The split between Vitest and Playwright

Vitest covers unit and component tests inside a package. Playwright covers
everything that needs a real browser: printing the PDF and the site's e2e.

The application has two Vitest configs, deliberately: `vitest.config.ts` runs the
component tests in jsdom, while `vitest.pdf.config.ts` checks the built PDF in a
`node` environment. They must not be merged — different environments, different
inputs.

## Setup

An application's global setup lives next to its sources:

```txt
apps/<app>/src/test-setup.ts
```

It wires up `@testing-library/jest-dom/vitest` and an **explicit**
`afterEach(cleanup)`: with `globals: false`, testing-library cannot find a global
`afterEach` and never registers its auto cleanup — without that line the second
`render` in a file fails with "Found multiple elements".

Vitest is configured by its own `vitest.config.ts`, which repeats the `@` alias
from `vite.config.ts`.

## The privacy guard

`pnpm guard` scans the git-tracked files for forbidden content. Two rules that
cost a separate investigation:

- **run it after `git add`.** The guard reads `git ls-files` and cannot see an
  untracked file: a run before `git add` is falsely green;
- **a green guard does not prove there is no leak.** The dictionary is
  `tools/repo-guard/patterns.ts`, and it is derived from the project's privacy
  rules rather than a replacement for them. New text is checked against those
  rules by a human reading it.

The dictionary lives in one module and is imported by the tests. A copy of a
pattern that turns out softer than the original is not a duplicate, it is a hole.
