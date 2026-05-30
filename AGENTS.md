# AGENTS.md — font-family-input

Composable, headless font-family picker shipped as framework packages.
See [PLAN.md](./PLAN.md) for the full architecture and roadmap.

## Repository

Bun-workspaces monorepo.

- `packages/core` — `@font-family-input/core`: framework-agnostic engine
  (store, filter, keyboard, font loader, provider contract, Google provider).
  No framework deps.
- `packages/react` — `@font-family-input/react`: composable, unstyled,
  virtualized React primitives.
- `apps/docs` — VitePress site: home page + documentation (GitHub Pages root).
- `apps/playground` — Vite + React live preview/playground (GitHub Pages `/preview/`),
  also the Playwright e2e target.

Package manager: **bun**. Bundler: **Vite library mode** + `vite-plugin-dts`.
Lint/format: **Biome**. Tests: **Vitest** (unit) + **Playwright** (e2e).

## Quality gate (run before delivering ANY change)

All of the following must pass. Fix issues before presenting the result.

```bash
bun run typecheck     # 1. Type check every package (tsc --noEmit)
bun run test          # 2. Unit tests (Vitest)
bun run test:e2e      # 3. End-to-end tests (Playwright)
bunx biome check .    # 4. Formatting + lint (use --write to auto-fix)
```

- **Types** — strict TypeScript, no `any`, no `as` coercions. Use proper types.
- **Unit tests** — core logic (store, filter, keyboard, loader) is covered by
  Vitest; add/adjust tests for any logic change.
- **E2E tests** — Playwright drives the rendered primitives (keyboard nav,
  virtualization, a11y). Run against the playground app.
- **Formatting** — Biome is the single source of truth. Never hand-format around it.

A change is not "done" until type check, unit tests, e2e tests, and formatting
are all green.

## Releases — use Changesets

Versioning and publishing are managed by **Changesets** (independent per-package
versions). Do **not** hand-edit versions or publish manually.

```bash
bun run changeset     # add a changeset describing the change (run per PR)
bun run version       # apply changesets -> bump versions + changelogs
bun run release       # build all packages, then `changeset publish`
```

Every user-facing change to a published package needs a changeset. Packages are
published to npm under the `@font-family-input/*` scope with public access.

## Conventions

- Headless + unstyled: ship behavior, ARIA roles, and `data-*` hooks only — no CSS.
- Keep `core` free of framework imports; framework packages are thin adapters.
- New font sources implement the `FontProvider` contract; don't hardcode Google.
- Controlled (`value`) and uncontrolled (`defaultValue`) usage must both work.
