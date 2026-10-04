# AGENTS.md

## Language and working style

- Instructions, explanations and project documentation are written in English.
- Names of files, directories, components, variables, functions, types and Git branches are written in English.
- The AI agent answers briefly, to the point, and without inventing facts.
- When critical information is missing, the agent states its assumption explicitly and picks the smallest safe option.
- When a task touches architecture, dependencies, Git flow, tooling or the resume data, the agent reads the relevant instructions first.

## What this repository is

A CV monorepo. One dataset, two artifacts: an ATS-readable PDF (EN) and a
bilingual CV website. The repository is **public**.

- `packages/config` — TypeScript and ESLint presets (`@cv/config`);
- `packages/cv-data` — the single source of truth: zod schemas, the technology
  registry, derived durations, and generation of the localized JSON chunks (`@cv/data`);
- `packages/ui` — impersonal interface primitives (`@cv/ui`);
- `apps/print` — a Vite app with print CSS, which Playwright prints to PDF (`@cv/print`);
- `apps/web` — the site, with a stack filter living in the search params (`@cv/web`).

Boundaries: `cv-data` imports no React. `ui` does not know the word "resume".
`print` depends on `cv-data` but **not** on `ui`. `web` glues everything together.

## Privacy

The repository is public, so none of the following exists in it:

- the personal phone number — it reaches the PDF only through the `CV_PHONE` environment variable;
- the employer work email; the contact address is `belibov.nikolay@gmail.com`;
- the employer internal metrics;
- screenshots, specs and design documents.

This is enforced by `pnpm guard` (`tools/repo-guard/privacy.test.ts`). The guard
runs before every merge. Its rules must never be weakened.

## Base stack

- **Vite + React + TypeScript**, with TypeScript in `strict` mode plus
  `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`.
- The monorepo runs on **pnpm workspaces + Turborepo**.
- Data is validated with zod. Routing and loading use TanStack Router + Query. Styling is Tailwind v4.
- Tests are Vitest, e2e is Playwright. Deployment is Netlify, CI is GitHub Actions.
- Node `>=22`.

## Package manager

The dependency manager is **pnpm**, with the version pinned in the
`packageManager` field and installed through `corepack`. This is a deliberate
departure from the EasyFop rule of "Bun only": a monorepo is part of the brief
here, and pnpm workspaces + Turborepo is the most recognizable pairing for it.

- A production dependency of a package: `pnpm add --filter <pkg> <name>`.
- A dev dependency of a package: `pnpm add -D --filter <pkg> <name>`.
- At the root, only `pnpm add -w -D <name>`, and only for what the whole repository needs.
- `pnpm-lock.yaml` must be committed to Git.
- `npm`, `yarn` and `bun` are forbidden unless the user explicitly allows them.
- Before adding a dependency, the agent checks whether the already installed stack can do the job.
- New production dependencies must not be added without explicit permission.

## Commands

Every command runs from the root and is `turbo run <task>` across the workspace:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm guard      # the privacy test for a public repository
pnpm pdf        # build the PDF
pnpm format
```

A single package: `pnpm --filter @cv/data test`.

The e2e suite lives in `apps/web` and runs against the **built** site:

```bash
pnpm --filter @cv/web build
pnpm --filter @cv/web e2e
```

## Linked Instructions

The AI agent must read the additional instructions before the matching tasks:

- Git flow, branches, commits or the PR process: `docs/instructions/git-flow.md`
- Husky, Commitlint, Prettier, ESLint, lint-staged, React components and quality rules: `docs/instructions/code-quality.md`
- Tests, test setup or test scripts: `docs/instructions/testing.md`
- Netlify, GitHub Actions, folding the PDF into the site, or e2e: `docs/instructions/deployment.md`

If a linked instruction file is missing, the agent does not invent its contents;
it reports the absence and offers to create a minimal version.

## Code conventions

- **Arrow functions only.** `export const Name = () => {}`; `function Name() {}` is forbidden.
- **Named exports only.** Components never use a default export.
- **Component-as-a-Folder.** A component is a folder: `Chip/Chip.tsx` + `Chip/index.ts`.
  Its test lives in the same folder. `types.ts` appears only once the prop types have outgrown the file.
- **Generated code is adapted to these rules.** If the `shadcn` CLI drops
  `components/ui/button.tsx` with `function Button()`, the file moves to
  `components/UI/Button/Button.tsx` and is rewritten. A library's documentation does not override the project's rules.
- **`cn` lives in `utils/classNames/classNames.ts`**, not in `lib/utils.ts`.
- **The `@` alias is mandatory in the apps** (`apps/web`, `apps/print`) and points at their `src`.
  Inside `packages/*` there is no alias — short relative imports are used there.
- **Styling is Tailwind plus CSS variables only.** SCSS, CSS-in-JS and CSS Modules are not used.
  Colors come from tokens and are never hardcoded in components.
- **shadcn components are added one at a time**; the whole set is never installed at once.
- **The theme has three modes:** `type ThemeMode = "system" | "light" | "dark"`, defaulting to `system`,
  with the user's choice stored in `localStorage`.

## Hard prohibitions

Without explicit permission, the AI agent must not:

- change the project stack;
- add production dependencies;
- change `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `turbo.json`,
  `tsconfig*.json`, or the ESLint, Prettier, Husky or Commitlint configs outside the scope of the task;
- weaken the rules in `tools/repo-guard/` or commit private data;
- rewrite the architecture or perform large refactors inside small tasks;
- delete existing code without explaining why;
- change the Git flow;
- create global abstractions where none are needed;
- use `npm`, `yarn` or `bun` to manage dependencies;
- ignore errors from TypeScript, ESLint, Prettier, the tests or the build;
- disable a linter, formatter or TypeScript rule just to get a check to pass;
- modify files outside the scope of the task.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
