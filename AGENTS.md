# AGENTS.md — font-family-input

Composable, headless font-family picker shipped as framework packages.
See [PLAN.md](./PLAN.md) for the full architecture and roadmap.

## Repository

Bun-workspaces monorepo.

- `packages/core` — `@font-family-input/core`: framework-agnostic engine
  (store, filter, keyboard, font loader, provider contract, Google provider +
  live `googleFontsApiProvider`). No framework deps.
- `packages/react` — `@font-family-input/react`: composable, unstyled,
  virtualized React primitives (`@tanstack/react-virtual`).
- `packages/vue` — `@font-family-input/vue`: Vue 3 primitives, `v-model`,
  `@tanstack/vue-virtual`.
- `packages/preact` — `@font-family-input/preact`: Preact primitives over
  `@tanstack/virtual-core`.
- `packages/solid` — `@font-family-input/solid`: Solid primitives,
  `@tanstack/solid-virtual`.
- `packages/svelte` — `@font-family-input/svelte`: Svelte 5 (runes) primitives,
  `bind:value`, fixed-height virtualization. Built with `svelte-package`.
- `packages/html` — `@font-family-input/html`: `<font-family-input>` custom
  element. Ships a self-contained UMD build (`unpkg`/`jsdelivr` fields) for CDN
  `<script>` use; core is bundled in.
- `apps/docs` — VitePress site: home page + full docs for all adapters (GitHub Pages root).
- `apps/playground` — Vite + React live preview/playground (GitHub Pages `/preview/`),
  also the Playwright e2e target. Demos React pickers + the Web Component.

Package manager: **bun**. Bundler: **Vite library mode** + `vite-plugin-dts`.
Svelte is built with `svelte-package`. Lint/format: **Biome**. Tests: **Vitest** (unit) + **Playwright** (e2e).

## ✅ STATUS (2026-05-30)

All 7 packages implemented, typechecked, tested, linted, and built green.
Gate: **biome clean, 45 unit tests (8 test projects), e2e 3/3, all 7 package builds pass.**

### Remaining roadmap
- **Angular adapter** — decision recorded: use **ng-packagr**. Not started.
- Consider adding a `@font-family-input/angular` package using ng-packagr for proper Angular library output.

## Quality gate (run before delivering ANY change)

All of the following must pass. Fix issues before presenting the result.

```bash
bun run typecheck     # 1. Type check every package (tsc --noEmit)
bun run test          # 2. Unit tests (Vitest)
bun run test:e2e      # 3. End-to-end tests (Playwright)
bunx biome check .    # 4. Formatting + lint (use --write to auto-fix)
```

Also run `svelte-check` for the Svelte package:
```bash
cd packages/svelte && bunx svelte-check --tsconfig ./tsconfig.json
```

- **Types** — strict TypeScript, no `any`, no `as` coercions. Use proper types.
- **Unit tests** — core logic (store, filter, keyboard, loader) is covered by Vitest;
  add/adjust tests for any logic change. Component tests assert behavior (open/close/
  keyboard/Empty/controlled), NOT virtualized row content (jsdom can't measure layout).
- **E2E tests** — Playwright drives the rendered primitives (keyboard nav, virtualization,
  a11y). Run against the playground app. Scope option clicks to the active content panel
  to avoid ambiguity across multiple pickers.
- **Formatting** — Biome is the single source of truth. Never hand-format around it.

A change is not "done" until type check, unit tests, e2e tests, and formatting are all green.

## Releases — use Changesets

Versioning and publishing are managed by **Changesets** (independent per-package versions).
Do **not** hand-edit versions or publish manually.

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

## Watch-outs

- **jsdom + TanStack Virtual** → no rows render. `test/setup.ts` polyfills
  ResizeObserver + layout boxes but row rendering still isn't reliable. Component
  tests assert behavior; e2e in Playwright covers real rendering.
- **Svelte**: don't destructure context as `state` (collides with the `$state`
  rune) — alias to `fontState`. Component prop types should extend
  `svelte/elements` `HTML*Attributes`, not a bare index signature.
- **`exactOptionalPropertyTypes`** is off for `packages/vue` (set in its tsconfig).
- **`@testing-library/svelte`** lives in `packages/svelte/devDependencies`
  (correct); not needed at the root.
- **Playground has multiple pickers** — e2e tests must scope option clicks to the
  active `content` panel, not use broad `getByText` which finds options in all pickers.
