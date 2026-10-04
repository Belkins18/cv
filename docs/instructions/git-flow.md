# Git Flow Instruction

## Purpose

This document describes the rules for working with Git, branches, commits and
pull requests.

The AI agent must read this file before:

- creating a new branch;
- changing the Git flow;
- preparing a pull request;
- merging into `development` or `master`;
- changing the commit rules;
- changing the release process.

## Main branches

The project uses two main branches:

```txt
master
development
```

### `master`

`master` is the stable production branch.

Rules:

- direct commits are forbidden;
- direct pushes are forbidden;
- code reaches `master` from `development`, either through a pull request or
  through a merge the project owner performs personally;
- the AI agent neither merges nor pushes into `master` without explicit
  permission for that specific action;
- a merge into `master` happens only after the project has been checked for
  stability.

### `development`

`development` is the main development and integration branch.

Rules:

- direct commits are forbidden: code arrives from a working branch;
- new tasks are branched only off an up-to-date `development`;
- code reaches `development` through a merge from `feat/*` or `fix/*`;
- **a pull request is not required.** The project is developed solo, and
  reviewing your own PR before your own merge is a ritual with no payoff. The
  merge is done locally with `--no-ff`, so the boundary of the task stays
  visible in the history;
- pushing to `development` is allowed;
- the checks before a merge are mandatory: `pnpm format`, `pnpm lint`,
  `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm guard`.

The pull-request rule was relaxed on 2026-09-21. It comes back the moment
someone else starts working on the project: reviewing someone else's code is no
longer a ritual.

## Working branches

New tasks get their own branches.

### Feature branches

For new features:

```txt
feat/short-feature-name
```

Examples:

```txt
feat/auth-page
feat/dashboard-filters
feat/user-settings
```

### Fix branches

For bug fixes:

```txt
fix/short-bug-name
```

Examples:

```txt
fix/button-click
fix/form-validation
fix/header-layout
```

### Other acceptable prefixes

Where it helps, these are fine too:

```txt
docs/update-readme
refactor/page-layout
chore/update-deps
test/add-form-tests
```

But for ordinary work, prefer:

```txt
feat/*
fix/*
```

## Starting a new task

Before starting a new task the agent must:

1. Check the current branch.
2. Make sure the work starts from `development`.
3. Update `development` if a remote is configured.
4. Create a new branch for the task.

Example:

```bash
git checkout development
git pull origin development
git checkout -b feat/example-feature
```

If no remote is configured yet, or the project is local-only, the agent must say
so and work with the local branch.

## Local MVP mode

While the project is a local MVP and no remote repository is connected yet:

- the agent still works through feature/fix branches;
- a pull request may be replaced by a local review of the diff;
- a merge into `development` happens only after the local checks pass;
- direct commits to `master` remain forbidden all the same.

## Commits

The project follows Conventional Commits.

Format:

```txt
type(scope): message
```

The minimal acceptable format:

```txt
type: message
```

Examples:

```txt
feat: add auth page
fix: correct button click handler
docs: update project instructions
chore: configure lint-staged
refactor: simplify dashboard layout
```

Accepted types:

```txt
feat
fix
docs
chore
style
refactor
ci
test
revert
perf
```

## Rules for commit messages

A commit message must:

- be in English;
- be short and clear;
- describe the change that actually happened;
- avoid vague phrases such as `update`, `fix stuff`, `changes`.

Bad:

```txt
update
fix
some changes
```

Good:

```txt
feat: add notification settings page
fix: handle empty form state
docs: move code quality setup to instructions
```

## Finishing a task: merging into development

Once a task is done, the `feat/*` or `fix/*` branch is merged into `development`
locally with `git merge --no-ff`. A pull request is not required — the section on
`development` above explains why.

Before the merge the agent must run:

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm guard
```

If one of these commands does not exist, the agent must say so explicitly.
A check may be reported as passing only if it was actually run.

The task report stands in for a PR description and contains:

- a short description of the task;
- a list of the main changes;
- the results of the checks;
- risks or limitations;
- what to verify by hand.

If a pull request is created after all — to preserve a discussion, say — its
description follows the same template:

```md
## Summary

- Added ...
- Updated ...
- Fixed ...

## Validation

- `pnpm format`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm guard`

## Notes

- ...
```

## Pull request from development into master

A PR from `development` into `master` is opened only when:

- all the functionality has been tested;
- the build succeeds;
- there are no known blocking bugs;
- the project is ready for a release.

Before merging into `master`, always run:

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm build
pnpm guard
```

And, where tests exist:

```bash
pnpm test
```

## Prohibitions

The AI agent must not:

- push directly to `master`;
- merge into `master` without explicit permission;
- merge without running the checks;
- delete branches without explicit permission;
- change the Git flow without explicit permission;
- rewrite Git history through `rebase`, `reset --hard` or a force push without
  explicit permission;
- create meaningless commits with messages such as `update` or `fix`.

## What the agent must report after a Git task

After working with Git, the agent reports briefly:

- the current branch;
- which branch it was created from;
- which commits were made;
- which checks were run;
- whether the branch has been merged into `development`;
- whether any conflicts or risks are still open.
