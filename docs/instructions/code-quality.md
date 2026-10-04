# Code Quality Instruction

## Purpose

This document describes how the code-quality tooling is set up and how to work
with it:

- Husky
- Commitlint
- Prettier
- Lint-Staged
- ESLint, where the project uses it

The AI agent must read this file before:

- changing the `package.json` scripts;
- configuring Prettier;
- configuring ESLint;
- configuring Husky;
- configuring Commitlint;
- configuring lint-staged;
- changing Git hooks;
- creating or changing React components;
- fixing formatting, linting or build errors.

## Monorepo

The project is a pnpm workspace under Turborepo. That has consequences:

- the quality tooling (husky, commitlint, prettier, lint-staged) lives **at the
  root only**; the packages carry no configs of their own, otherwise one rule
  drifts into five copies;
- `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` at the root are
  `turbo run <task>`: turbo walks the packages itself and respects their build
  order;
- a dependency is installed into a specific package:
  `pnpm add --filter @cv/web <name>`, or `pnpm add -D --filter @cv/web <name>`
  for a dev dependency. At the root, only `-w -D`, and only for what the whole
  repository needs;
- `pnpm guard` is a separate run of the privacy test: the repository is public.

## General rules

The AI agent must not:

- disable a linter rule without explaining why;
- delete Husky hooks without explicit permission;
- change the Commitlint rules without explicit permission;
- replace pnpm with `npm`, `yarn` or `bun`;
- add new code-quality tools without explaining why;
- ignore errors from TypeScript, ESLint, Prettier or the build.

When a check fails, the agent fixes the cause of the error rather than switching
the rule off.

## The tools in use

### Husky

Husky runs the Git hooks.

What it is for:

- running the checks before a commit;
- validating the commit message;
- synchronizing dependencies automatically after a merge, where that is set up.

### Commitlint

Commitlint validates commit messages against Conventional Commits.

### Prettier

Prettier formats code and documentation automatically.

### Lint-Staged

Lint-Staged runs the checks only over the changed files before a commit.

### ESLint

ESLint is used where the project already has it configured.

The agent must not add or rewrite the ESLint configuration without a task of its
own.

## Installing the dependencies

Installing Husky:

```bash
pnpm add -w -D husky
pnpm exec husky init
```

Installing Commitlint:

```bash
pnpm add -w -D @commitlint/config-conventional @commitlint/cli
```

Installing Lint-Staged and Prettier:

```bash
pnpm add -w -D lint-staged prettier
```

If some of these are already installed, the agent must not reinstall them
without a reason.

## package.json scripts

`package.json` must carry a formatting script:

```json
{
  "scripts": {
    "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,css,scss,md,json}' --config ./.prettierrc"
  }
}
```

If the project has a `README.md`, root-level `.md` files or documentation outside
`src`, the glob may be widened:

```json
{
  "scripts": {
    "format": "prettier --write '**/*.{js,jsx,ts,tsx,css,scss,md,json}' --config ./.prettierrc"
  }
}
```

Before changing the scripts, the agent must read the current `package.json`.

If the project already has `lint`, `build`, `test` or other scripts, the agent
uses the existing commands.

## Prettier config

The recommended minimal `.prettierrc`:

```json
{
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 80,
  "semi": false,
  "arrowParens": "always"
}
```

If the project already has a `.prettierrc`, the agent must not rewrite it without
a reason.

## Commitlint config

The file at the project root:

```txt
commitlint.config.js
```

Contents:

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'chore',
        'style',
        'refactor',
        'ci',
        'test',
        'revert',
        'perf'
      ]
    ]
  }
}
```

## Husky commit-msg hook

The file:

```txt
.husky/commit-msg
```

Contents:

```bash
pnpm exec commitlint --edit "$1"
```

What it is for:

- blocking commits with a malformed message;
- keeping Conventional Commits in force.

## Lint-Staged config

The configuration may live in `package.json`:

```json
{
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx}": ["eslint --max-warnings=0", "prettier --write"],
    "**/*.{html,json,css,scss,md,mdx}": ["prettier --write"]
  }
}
```

Or in a file of its own:

```txt
.lintstagedrc
```

The contents of `.lintstagedrc`:

```json
{
  "**/*.{js,jsx,ts,tsx}": ["eslint --max-warnings=0", "prettier --write"],
  "**/*.{html,json,css,scss,md,mdx}": ["prettier --write"]
}
```

Important:

- if ESLint is not configured, the agent must not add `eslint --max-warnings=0`
  to lint-staged without configuring ESLint separately;
- if ESLint is already configured, use the project's existing command;
- if a command fails, fix the cause rather than removing the command.

## Husky pre-commit hook

The file:

```txt
.husky/pre-commit
```

Contents:

```bash
pnpm exec lint-staged
```

What it is for:

- running formatting and linting over the staged files only;
- not reformatting the whole project on every commit.

## Husky post-merge hook

The file:

```txt
.husky/post-merge
```

Contents:

```bash
pnpm install
```

What it is for:

- synchronizing dependencies automatically after a merge or a pull;
- reducing the risk of working against a stale `pnpm-lock.yaml`.

On a small project, or where the hook gets in the way of the workflow, it may be
left out. That decision is recorded in `docs/instructions/`.

## Checks after changing code

After ordinary changes the agent checks which scripts `package.json` offers.

Usually these:

```bash
pnpm format
pnpm lint
pnpm test
pnpm build
```

And, where the project has tests:

```bash
pnpm test
```

If a command is missing from `package.json`, the agent says so explicitly:

```txt
The `pnpm lint` command is absent from package.json, so it was not run.
```

The agent must not claim that a check passed if it was never run.

## Checks after changing the quality configuration

After changing Husky, Commitlint, Prettier, ESLint or lint-staged, the agent must:

1. Read `package.json`.
2. Check that the required dev dependencies are present.
3. Check the corresponding config files.
4. Run the available checks.
5. Report the result.

The minimal report:

```md
## Validation

- `pnpm format` — passed
- `pnpm lint` — passed
- `pnpm build` — passed

## Notes

- ...
```

If a check fails:

```md
## Validation

- `pnpm lint` — failed

## Error

...

## Fix

...
```

## Rules for creating React components

1. Every functional React component is declared as an arrow function:

```tsx
export const MyComponent = () => {
  return <div />
}
```

React components are exported as named exports. A default export is not used for
a React component unless a task grants a specific exception.

Function declarations are forbidden for React components:

```tsx
function MyComponent() {
  return <div />
}
```

2. The project uses the **Component-as-a-Folder** approach.

Single component files directly at the root of `components`, `pages`, `features`
or any other feature directory are forbidden.

The correct structure of a component:

```txt
src/components/Button/
  Button.tsx
  index.ts
  Button.module.css
  types.ts
```

UI primitives follow the same Component-as-a-Folder logic:

```txt
src/components/UI/Button/
  Button.tsx
  index.ts
```

Forbidden:

```txt
src/components/ui/button.tsx
src/components/UI/Button.tsx
```

3. `index.ts` exists to export the component outwards cleanly.

Example:

```ts
export { Button } from './Button'
```

4. `types.ts` is created only once the prop types or the related interfaces have
   grown large.

5. A new component follows the styling and architectural patterns the project
   already uses.

6. Generated UI components obey these rules too. If a CLI or a generator produces
   a different shape, the result is adapted before the task is finished.

## Rules for the AI agent

The AI agent must:

- use pnpm for every command;
- check the existing scripts before running anything;
- not add new quality tools without a reason;
- not rewrite a config wholesale where a targeted change will do;
- not disable rules to get a check to pass;
- document non-obvious decisions in `docs/instructions/`.

## What the agent must report after a task

After changing the code-quality setup, the agent reports briefly:

- which dependencies were added;
- which config files were changed;
- which hooks were created or changed;
- which checks were run;
- which problems remain;
- whether anything needs to be done by hand.
