# CV — the entry point for an AI agent

The project rules live in `AGENTS.md` and in `docs/instructions/`. This file
exists so that a handful of things land in the agent's context immediately.

## Read before starting work

- `AGENTS.md` — the stack, the package layout, the package manager, the prohibitions;
- `docs/instructions/` — rules by topic: git flow, code quality, testing, deployment.

## The essentials about this repository

The repository is **public**. The personal phone number, the employer work email
and the employer internal metrics exist in it in no form whatsoever — `pnpm guard`
checks that. The phone number reaches the PDF only through the `CV_PHONE`
environment variable.

A monorepo on pnpm + Turborepo. `npm`, `yarn` and `bun` are forbidden.
Commands run from the root: `pnpm lint`, `pnpm typecheck`, `pnpm test`,
`pnpm build`, `pnpm guard`.

## Context hygiene

One chat, one stage of work. The context is cleared at two boundaries:

- **once the plan is written and approved** — the implementation moves to a new chat;
- **once a task is implemented and committed** — the next task starts from a
  clean slate.

Anything that has to survive the clearing is written to disk beforehand:
decisions go into `docs/instructions/`, the state of the work goes into the plan,
and the code goes into a commit.

## Language

Communication and documentation are in English. So are the names of files, code
and Git branches. Code comments are in English too, and they explain "why"
rather than "what".
