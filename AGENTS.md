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
- `apps/docs` — VitePress site: home page + documentation (GitHub Pages root).
- `apps/playground` — Vite + React live preview/playground (GitHub Pages `/preview/`),
  also the Playwright e2e target.

## ⏳ IN-PROGRESS REPORT (2026-05-30) — READ FIRST

We're mid-stream adding framework adapters. **`main` currently has a RED gate**
(last commit `ff9f57b` was pushed before checks were green — see Next steps).

### Done & verified green earlier
- core (engine + `googleFontsApiProvider` + tests), react, vue, html, solid:
  built, typechecked, tested in their own commits.
- Web Component made CDN/unpkg-ready (UMD build, `unpkg`/`jsdelivr` fields).
- CI workflow actions bumped to Node24 versions (checkout@v5,
  upload-pages-artifact@v5, deploy-pages@v5) — committed in `70a1c07`/later.
- GitHub Pages live (docs `/`, playground `/preview/`).

### KNOWN FAILURES to fix next (exact, reproduced via per-package checks)
1. **core typecheck** — `packages/core/src/providers/google-api.test.ts:35`
   `TS2493: Tuple type '[]' has no element at index '0'`. The `vi.fn(() => …)`
   mock has an empty args tuple; type the mock param, e.g.
   `vi.fn((_url: string) => …)` and read `mock.calls[0]?.[0]` (the earlier
   `mock.lastCall` edit may have regressed). Re-verify with
   `cd packages/core && bunx tsc --noEmit`.
2. **preact typecheck** — `packages/preact/src/primitives.tsx:109`
   `TS2339: Property 'placeholder' does not exist on type 'SearchProps'`.
   `SearchProps = Omit<JSX.HTMLAttributes<HTMLInputElement>, "value"|"onChange">`
   — under Preact's JSX types `placeholder` isn't surfaced there. Fix by adding
   `placeholder?: string` to a widened `SearchProps`, or read it from `rest`.
3. **vue unit test** — `packages/vue/src/FontInput.test.ts` “opens on click and
   lists fonts” fails (`expected 'Select font…' to contain 'Inter'`): jsdom
   can't measure layout so `@tanstack/vue-virtual` renders 0 rows. Rewrite this
   case to assert behavior (open state / Empty / keyboard / controlled) like the
   react+preact suites already do — do NOT assert on virtualized row text in
   jsdom. (react/preact/solid/svelte suites are already green.)
4. **biome** — was failing in the combined run; re-run `bunx biome check .`
   after the above and `bunx biome check --write .` for any format/import-order
   nits. (Most prior failures were autofixable.)

### Uncommitted when we stopped
`bun.lock`, `package.json` (added `@testing-library/svelte` dep — note it landed
in ROOT devDeps; consider moving to `packages/svelte`), and earlier `packages/svelte/`
(now committed in `ff9f57b`).

### Next steps (in order)
1. Fix (1)–(4) above. 2. Run the full gate (typecheck all 7 libs + svelte-check,
   `bun run test`, `bunx biome check .`, `bunx playwright test`). 3. Build all:
   `for p in core react vue preact solid svelte html; do bun run --filter
   "@font-family-input/$p" build; done`. 4. Commit only when fully green; push.
5. Remaining roadmap: **Angular adapter** (decision recorded: use **ng-packagr**,
   separate build pipeline from Vite). 6. Optionally wire the new adapters into
   the docs/playground and add per-package READMEs.

### Watch-outs learned
- jsdom + TanStack Virtual → no rows; `test/setup.ts` polyfills
  ResizeObserver + layout boxes but row rendering still isn't reliable, so
  component tests assert behavior, not row contents (e2e covers real rendering).
- Svelte: don't destructure context as `state` (collides with the `$state`
  rune) — alias to `fontState`. Component prop types should extend
  `svelte/elements` `HTML*Attributes` (not an index signature).
- `exactOptionalPropertyTypes` is off for `packages/vue` (set in its tsconfig).

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
