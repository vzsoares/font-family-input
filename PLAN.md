# font-family-input — Build Plan

A composable, headless font-family picker, extracted from the Alpine.js `FontField`
prototype, rebuilt as a set of framework-agnostic npm packages.

## Decisions (from interview)

| Area            | Decision |
|-----------------|----------|
| Architecture    | **Headless core + thin framework adapters** |
| Styling         | **Fully headless / unstyled** — behavior, ARIA, `data-*` attributes only |
| Virtualization  | **TanStack Virtual** (`@tanstack/virtual-core` in core, `@tanstack/react-virtual` in react) |
| Font source     | **Provider supplies list + loader** — `{ listFonts(), loadFont() }`; default `GoogleFontsProvider` |
| Monorepo        | **Bun workspaces** |
| Bundler         | **Vite library mode** + `vite-plugin-dts` (shared with Storybook) |
| v1 packages     | **`core`, `react`** |
| Value model     | **Controlled + uncontrolled** |
| `html` target   | **Web Component** (`<font-family-input>`) — *post-v1* |
| npm scope       | **`@font-family-input/*`** |
| Default list    | **Bundled static Google list** (offline, no API key); async/live mode later |
| Accessibility   | **Full WAI-ARIA combobox/listbox** (arrow keys, type-ahead, Home/End, Enter/Esc) |
| Testing / docs  | **Vitest + Playwright + Storybook** |

## Package layout

```
font-family-input/
├─ package.json                 # private root, workspaces, scripts
├─ bunfig.toml
├─ tsconfig.base.json
├─ biome.json                   # lint + format (fast, single tool)
├─ vitest.workspace.ts
├─ .changeset/                  # versioning (see "Releases" below)
├─ packages/
│  ├─ core/                     # @font-family-input/core  (no framework deps)
│  │  └─ src/
│  │     ├─ index.ts
│  │     ├─ types.ts            # FontItem, FontProvider, FontInputState
│  │     ├─ provider.ts         # FontProvider contract
│  │     ├─ providers/google.ts # GoogleFontsProvider (list + CSS loader)
│  │     ├─ data/google-fonts.ts# bundled static font list (~1.5k names)
│  │     ├─ store.ts            # createFontInput() — reactive state machine
│  │     ├─ filter.ts           # search/filter strategy (overridable)
│  │     ├─ loader.ts           # font CSS injection: dedup, system-font skip
│  │     ├─ keyboard.ts         # combobox key → action mapping
│  │     └─ virtual.ts          # @tanstack/virtual-core glue helpers
│  └─ react/                    # @font-family-input/react
│     └─ src/
│        ├─ index.ts
│        ├─ context.ts
│        ├─ useFontInput.ts     # binds core store via useSyncExternalStore
│        └─ primitives/         # Radix-style composable parts
│           Root / Trigger / Portal / Content / Search / List / Item / Empty
├─ apps/
│  └─ storybook-react/          # docs + visual playground (Vite + Storybook)
└─ e2e/                         # Playwright specs (keyboard, virtualization, a11y)
```

## Core design (`@font-family-input/core`)

Framework-agnostic engine. No DOM-framework deps; only `@tanstack/virtual-core`.

### Provider contract
```ts
export interface FontItem {
  family: string;
  category?: string;      // serif | sans-serif | display | handwriting | monospace
  // room for weights/subsets later
}

export interface FontProvider {
  listFonts(): FontItem[] | Promise<FontItem[]>;
  loadFont(family: string): void | Promise<void>;   // inject preview CSS
}
```
- `GoogleFontsProvider` (default): `listFonts()` returns the bundled static list;
  `loadFont()` ports the prototype's logic — skip system/generic fonts, dedup by
  `<style id>`, inject `@import url(fonts.googleapis.com/css2?...)`.
- Custom sources: user passes any object satisfying `FontProvider`
  (self-hosted, Adobe, Bunny Fonts, local `@font-face`, etc.).
- *Post-v1:* `loadOnHighlight` already supported; live/paginated async catalog
  (Google Fonts API w/ key) slots in as another provider — no contract change.

### Headless store
`createFontInput(options)` returns a tiny framework-agnostic reactive store
(getState / subscribe / actions) — the pattern TanStack & Zag.js use.

```ts
createFontInput({
  provider?,            // default GoogleFontsProvider
  value?, defaultValue?,// controlled / uncontrolled
  onChange?,
  filter?,              // override search strategy
  loadOnHighlight?,     // lazy-load preview as you arrow/hover
})
```
State: `{ open, search, filtered, highlightedIndex, value }`.
Actions: `open/close/toggle`, `setSearch`, `highlight(index)`, `select(family)`.
`keyboard.ts` maps keydowns → actions (combobox pattern, virtualization-aware).
`virtual.ts` exposes the virtualizer config so adapters wire it to their DOM.

## React adapter (`@font-family-input/react`)

Composable, unstyled primitives (compound-component / Radix style). All visual
styling is the consumer's; we ship roles, `aria-*`, and `data-state`/`data-highlighted`
hooks for CSS.

```tsx
<FontInput.Root value={v} onValueChange={setV} provider={provider}>
  <FontInput.Trigger />                 {/* shows value, toggles open */}
  <FontInput.Portal>
    <FontInput.Content>
      <FontInput.Search placeholder="Search fonts…" />
      <FontInput.List>                  {/* virtualized scroll viewport */}
        {(font) => (
          <FontInput.Item value={font.family}>
            <span style={{ fontFamily: font.family }}>{font.family}</span>
          </FontInput.Item>
        )}
      </FontInput.List>
      <FontInput.Empty>No fonts found</FontInput.Empty>
    </FontInput.Content>
  </FontInput.Portal>
</FontInput.Root>
```
- `List` uses `@tanstack/react-virtual`; children-as-function renders only visible
  items so the ~1.5k list stays smooth.
- `useFontInput()` exposes the store for fully custom markup (escape hatch).
- Controlled (`value`/`onValueChange`) and uncontrolled (`defaultValue`) both work.

## Tooling & conventions

- **Bun workspaces**; `bun install` at root.
- **Vite library mode** per package (`formats: ['es','cjs']`) + `vite-plugin-dts`
  for `.d.ts`. `package.json` `exports` map with `import`/`require`/`types`.
- **Biome** for lint+format (fast single tool) — or ESLint+Prettier if you prefer.
- **Vitest** unit tests (core: filter/loader/store/keyboard logic).
- **Playwright** e2e against the Storybook build (keyboard nav, virtualization
  rendering, a11y assertions).
- **VitePress** for the home page + documentation; a **Vite + React playground**
  for the live, interactive preview.
- **TypeScript strict**, no `any`, no `as` coercions (per your global rules).
- `react`/`react-dom` and `@tanstack/react-virtual` as **peerDependencies** of the
  react package; `@font-family-input/core` as a regular dep.

## Documentation & GitHub Pages

Single GitHub Pages site combining a marketing **home page**, **documentation**,
and a live **preview/playground**.

- **`apps/docs`** — [VitePress](https://vitepress.dev) site (Vite-based, fits our
  stack). Owns the **home page** (hero + features) and all **documentation**
  (getting started, core API, react primitives, providers, virtualization, a11y).
- **`apps/playground`** — a lightweight Vite + React app = the interactive
  **preview**. (Chosen over Storybook, whose toolchain proved fragile under bun's
  hoisted linker.) Also serves as the Playwright e2e target.
- **Deploy** — a GitHub Actions workflow builds both, nests Storybook under the
  docs output at `/preview/`, and publishes via the Pages action.

Routing (project pages → served under `/font-family-input/`):

| Path                              | Content                          |
|-----------------------------------|----------------------------------|
| `/font-family-input/`             | Home page (VitePress)            |
| `/font-family-input/guide/…`      | Documentation (VitePress)        |
| `/font-family-input/preview/`     | Playground (Vite + React)        |

## Releases (one open item)

Monorepo with independent package versions → I'm defaulting to **Changesets**.
Your global tooling (`zen-release`) is single-repo oriented. Options:
1. Changesets (independent per-package versions, generates changelogs) — *default*.
2. `zen-release` with fixed/locked versions across packages.
Flag your preference; otherwise I proceed with Changesets.

## Build phases

1. **Scaffold** — bun workspaces, root configs, tsconfig base, biome, vitest
   workspace, empty `core` + `react` packages with Vite lib configs.
2. **Core: providers + loader** — types, `FontProvider`, `GoogleFontsProvider`,
   bundled static list, `loader.ts` (ported + tested).
3. **Core: store + filter + keyboard** — state machine, search, combobox keys;
   unit tests.
4. **Core: virtualization glue** — `virtual.ts` over `@tanstack/virtual-core`.
5. **React primitives** — Root/Trigger/Portal/Content/Search/List/Item/Empty,
   `useFontInput`, controlled+uncontrolled, full a11y, virtualized List.
6. **Storybook** — stories: default, custom provider, custom markup, controlled.
7. **Tests** — Vitest (core) + Playwright (e2e via Storybook). Lint/format/types green.
8. **Polish & publish prep** — READMEs, exports maps, sideEffects, Changesets,
   dry-run publish.

## Post-v1 backlog
- `@font-family-input/html` Web Component (`<font-family-input>`).
- Live/async Google Fonts API provider (catalog pagination + API key).
- Extra providers: Bunny Fonts, Fontsource, self-hosted.
