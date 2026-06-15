---
name: commit
description: Commit staged changes grouped by logical change. Use when committing multiple independent changes separately, when you need to create atomic commits per logical unit of work, or after making a mix of changes across the codebase. Analyzes git status and creates properly formatted commits following commitlint conventions.
---

# Commit Per Change

Create separate commits for each logical change, following the project's commitlint conventions (`@commitlint/config-conventional`). A "logical change" is a coherent unit of work — one feature, one fix, one refactor — regardless of how many files or directories it touches.

## Core Principle

**Group by intent, not by location.** A single feature that spans multiple folders is one commit. Two unrelated fixes in the same folder are two commits.

## SPA Structure

This is a TanStack Router SPA. Only the `public/` and `src/` folders hold application code — use this map to choose the right scope and group changes by intent.

```
public/                       Static assets served as-is (favicon, logos)
  favicon.svg
  logo-full.svg

src/
  bootstrap/                  App entry, mounting, and generated wiring
    index.html                HTML shell
    app.tsx                   App bootstrap / mount
    reportWebVitals.ts        Web-vitals reporting
    routeTree.gen.ts          Generated route tree (tooling output, Biome-ignored)
  routes/                     TanStack Router route modules
    __root.tsx                Root route / layout
    index.tsx                 Index route
  features/                   Feature modules — one folder per feature
    <feature>/                e.g. `user`, a self-contained vertical slice
      assets/                 Feature-local static assets
      components/             Feature UI components
      hooks/                  Feature React hooks (data fetching / API)
      layouts/                Feature layout components
      services/               Business logic
      store/                  Feature state management
      styles/                 Feature-scoped styles
      types/                  Feature TypeScript types
      utils/                  Feature helpers
  shared/                     Cross-feature shared code (mirrors a feature's layout)
    assets/                   Shared static assets
    components/               Shared UI components
    hooks/                    Shared React hooks (data fetching / API)
    layouts/                  Shared layout components
    services/                 Shared business logic
    store/                    Shared state management
    styles/                   Shared / global styles
    types/                    Shared TypeScript types
    utils/                    Shared helpers
```

**Scope mapping:**
- `public/` → `public`
- `src/bootstrap/` → `bootstrap`
- `src/routes/` → `routes`
- `src/features/**` → `features`
- `src/shared/**` → `ui` (shared components), or omit when no scope fits

A feature is a vertical slice: a change touching several subfolders of one `features/<feature>` is **one** commit (scope `features`). Two unrelated features are two commits even though both live under `features/`.

## Never Add Co-Authors

Do **not** add a `Co-Authored-By` trailer (or any Claude/AI attribution) to commit messages. Commits are authored solely by the repository's git user. Use plain `git commit -m "..."` with the message only.

## Workflow

1. **Survey all changes**
   - Run `git status --porcelain` to list modified files
   - Run `git diff` (and `git diff --staged`) to understand what actually changed
   - Read the diffs — don't rely on file paths alone to infer intent

2. **Group files by logical change**
   - Identify coherent units: each feature, fix, refactor, or concern is its own group
   - A single group may span multiple folders (e.g., a feature touching `features` + `routes`)
   - A single folder may contribute to multiple groups (split it across commits)
   - Unrelated changes must go in separate commits, even if they sit in the same file — use `git add -p` for hunk-level staging when needed

3. **For each logical change**
   - Stage only the files (or hunks) belonging to that change
   - Choose the best-fitting `type` and optional `scope` based on the change itself
   - Commit with proper format: `type(scope): subject`
   - Repeat until the working tree is clean (or only unrelated work remains)

## Commit Message Format

```
type(scope): subject line
```

The `(scope)` is optional under `config-conventional`; include it when it adds clarity.

### Valid Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring (no new feature, no bug fix)
- `test`: Adding/updating tests
- `chore`: Maintenance tasks (dependencies, configs)
- `docs`: Documentation changes
- `style`: Code style changes (formatting, whitespace)
- `perf`: Performance improvements
- `build`: Build system changes
- `ci`: CI configuration changes
- `revert`: Revert a previous commit

### Suggested Scopes
There is no custom scope enum, so scopes are free-form (must be lower-case). Prefer scopes that map to the project's structure:
- `features`: Feature modules (`src/features`)
- `routes`: TanStack Router routes (`src/routes`)
- `bootstrap`: App bootstrap and entry (`src/bootstrap`)
- `ui`: Shared UI components
- `public`: Static assets (`public/`)
- `deps`: Dependencies (`package.json`, `bun.lock`)
- `config`: Root tooling/config (`biome.jsonc`, `tsconfig.json`, `vite.config.ts`)

When a logical change spans multiple scopes, pick the scope that best represents the **primary** intent of the change. If truly split, prefer separate commits. Omit the scope entirely when none fits cleanly.

### Subject Rules
- **Lower-case** the subject — `config-conventional` rejects sentence-case, start-case, pascal-case, and upper-case subjects
- Use imperative mood ("add feature" not "added feature")
- No period at the end
- Type and scope must be lower-case
- Maximum 100 characters for the entire header

## Choosing Commit Type

Let the nature of the change — not the file type — decide:

| Change Pattern | Type |
|---------------|------|
| New user-facing capability | `feat` |
| Corrects broken behavior | `fix` |
| Restructure without behavior change | `refactor` |
| Only test files changed | `test` |
| Only documentation (`*.md`) | `docs` |
| Dependencies, lockfiles | `chore` |
| Build tooling (Vite, bundler configs) | `build` |
| CI/CD workflows | `ci` |
| Formatting, whitespace only | `style` |
| Measurable performance work | `perf` |

If a change mixes types, pick the one that reflects the primary intent and mention the rest in the subject or split the commit.

## Examples

### Example 1: Multiple Independent Changes

Git status shows:
```
M src/features/editor/Toolbar.tsx
M src/features/editor/Editor.tsx
M src/routes/index.tsx
M vite.config.ts
M bun.lock
```

After reading the diffs you discover:
- `Toolbar.tsx` + `Editor.tsx` → new rich-text formatting controls
- `index.tsx` → fixes a route loader crash
- `vite.config.ts` → tweaks the dev server port
- `bun.lock` → unrelated dependency bump

Commands to execute:
```bash
# Feature: editor formatting controls
git add src/features/editor/Toolbar.tsx src/features/editor/Editor.tsx
git commit -m "feat(features): add rich-text formatting controls"

# Fix: route loader crash
git add src/routes/index.tsx
git commit -m "fix(routes): prevent crash in index route loader"

# Build: dev server config
git add vite.config.ts
git commit -m "build(config): change dev server port to 3000"

# Dependency bump
git add bun.lock
git commit -m "chore(deps): update dependencies"
```

### Example 2: Single Logical Change Spanning Folders

Git status shows:
```
M src/features/auth/SignIn.tsx
M src/routes/__root.tsx
M src/bootstrap/app.tsx
```

All three files implement the same feature (Clerk authentication wiring). This is **one** commit — pick the scope that represents the primary intent:
```bash
git add src/features/auth/SignIn.tsx src/routes/__root.tsx src/bootstrap/app.tsx
git commit -m "feat(features): wire up clerk authentication"
```

### Example 3: Multiple Changes in the Same File

`git diff src/features/editor/Editor.tsx` reveals two unrelated edits:
- A bug fix for cursor placement on paste
- A refactor renaming internal state variables

Stage per-hunk to keep them atomic:
```bash
git add -p src/features/editor/Editor.tsx   # accept the fix hunks
git commit -m "fix(features): keep cursor position on paste"

git add src/features/editor/Editor.tsx      # stage the rest
git commit -m "refactor(features): rename editor state variables"
```

### Example 4: Refactor with Renames/Deletions

Git status shows:
```
D src/features/editor/OldEditor.tsx
A src/features/editor/Editor.tsx
M src/routes/index.tsx
```

All part of the same rewrite:
```bash
git add src/features/editor/OldEditor.tsx src/features/editor/Editor.tsx src/routes/index.tsx
git commit -m "refactor(features): replace OldEditor with Editor"
```

## Subject Line Guidelines

Write clear, descriptive, lower-case subjects:

| Good | Bad |
|------|-----|
| `add rich-text formatting controls` | `wizard` |
| `prevent crash in index route loader` | `fix bug` |
| `replace OldEditor with Editor` | `rename` |
| `remove deprecated api helpers` | `cleanup` |
| `change dev server port to 3000` | `config change` |

## Pre-commit Checklist

Before each commit, verify:
1. The staged files belong to **one** logical change
2. No unrelated edits are sneaking in (run `git diff --staged` to confirm)
3. No debug code, `console.log`, or temporary scaffolding left behind (Biome flags `noConsole` as an error)
4. Subject line is lower-case, imperative, and matches the format exactly
5. No `Co-Authored-By` or AI-attribution trailer is added

## Handling Special Cases

### A File Contains Multiple Logical Changes
Use `git add -p` to stage hunks individually. Commit each logical change separately. Do not bundle unrelated edits just because they share a file.

### A Change Legitimately Touches Many Scopes
Pick the scope that represents the primary intent (usually where the user-visible behavior lives). Mention the supporting changes in the subject if it helps clarity. Split only when the sub-changes are independently useful.

### Formatting Noise Mixed With Real Changes
Commit the real change first with its proper type/scope, then commit the formatting separately as `style(scope): …`. Never hide behavior changes behind a `style` commit.

### Generated Files
`*.gen.ts` / `*.gen.tsx` (e.g. `src/bootstrap/routeTree.gen.ts`) are produced by tooling and Biome-ignored. Commit them alongside the change that regenerates them, not as standalone edits.

### Deletions or Renames
Classify by intent, not by the `D`/`R` status:
- Removing dead code → `refactor`
- Removing a feature the user could see → `feat` (with a "remove …" subject) or `refactor` if purely internal
- Reorganizing files without behavior change → `refactor`
