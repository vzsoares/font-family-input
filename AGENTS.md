# AGENTS.md — font-family-input

Composable, headless font-family picker shipped as framework packages.

## Repository

Bun-workspaces monorepo.

- `packages/core` — `@font-family-input/core`: framework-agnostic engine (store, filter, keyboard, font loader, provider contract, bundled Google Fonts + live `googleFontsApiProvider`). No framework deps.
- `packages/react` — `@font-family-input/react`: composable, unstyled, virtualized React primitives (`@tanstack/react-virtual`).
- `packages/vue` — `@font-family-input/vue`: Vue 3 primitives, `v-model`, `@tanstack/vue-virtual`.
- `packages/preact` — `@font-family-input/preact`: Preact primitives over `@tanstack/virtual-core`.
- `packages/solid` — `@font-family-input/solid`: Solid primitives, `@tanstack/solid-virtual`.
- `packages/svelte` — `@font-family-input/svelte`: Svelte 5 (runes) primitives, `bind:value`, fixed-height virtualization. Built with `svelte-package`.
- `packages/html` — `@font-family-input/html`: `<font-family-input>` custom element. Self-contained UMD build (`unpkg`/`jsdelivr`) for CDN use.
- `apps/docs` — VitePress site: home page + docs for all adapters (GitHub Pages root).
- `apps/playground` — Vite + React playground (GitHub Pages `/preview/`); Playwright e2e target. Aliases `@font-family-input/html` to its TS source to avoid Vite pre-scan issues.

Package manager: **bun**. Bundler: **Vite library mode** + `vite-plugin-dts` (svelte uses `svelte-package`). Lint/format: **Biome**. Tests: **Vitest** (unit) + **Playwright** (e2e).

## Quality gate (run before delivering ANY change)

```bash
bun run typecheck     # tsc --noEmit for every package
bun run test          # Vitest unit tests
bun run test:e2e      # Playwright e2e
bunx biome check .    # lint + format (--write to auto-fix)
# Also for Svelte:
cd packages/svelte && bunx svelte-check --tsconfig ./tsconfig.json
```

- **Types** — strict TypeScript, no `any`, no `as` coercions.
- **Unit tests** — assert behavior (open/close/keyboard/Empty/controlled), NOT virtualized row content (jsdom can't measure layout). Playwright covers real rendering.
- **E2E** — scope option clicks to the active content panel; the playground has multiple pickers so broad `getByText` is ambiguous.
- **Formatting** — Biome is authoritative. Never hand-format around it.

A change is not done until all four checks are green.

## Releases — Changesets

```bash
bun run changeset     # describe a change (run per PR)
bun run version       # bump versions + generate changelogs
bun run release       # build all packages + changeset publish
```

Packages are published to npm under `@font-family-input/*` with public access. Use an **Automation** token (not Classic/Publish) to bypass 2FA.

## Conventions

- Headless + unstyled: behavior, ARIA, and `data-*` hooks only — no CSS.
- `core` has no framework imports; adapters are thin bindings.
- Custom font sources implement `FontProvider`; don't hardcode Google.
- Controlled (`value`) and uncontrolled (`defaultValue`) both work in every adapter.

## Watch-outs

- **jsdom + TanStack Virtual** — no rows render in unit tests; `test/setup.ts` polyfills ResizeObserver + layout boxes but row rendering is still unreliable. Assert behavior in unit tests; real rendering is covered by Playwright.
- **Svelte** — don't destructure context as `state` (collides with the `$state` rune); alias to `fontState`. Component props should extend `svelte/elements` `HTML*Attributes`.
- **`exactOptionalPropertyTypes`** is off in `packages/vue/tsconfig.json`.
- **Playground vite alias** — `@font-family-input/html` is aliased to its TS source so Vite doesn't need a pre-built `dist/` at dep-scan time.
- **`@testing-library/svelte`** lives in `packages/svelte/devDependencies` (correct); not needed at root.
