# @font-family-input/html

## 0.1.0

### Minor Changes

- 0eb161a: Initial release: a composable, headless, virtualized font-family picker.

  - `@font-family-input/core` — framework-agnostic engine: reactive store, search
    filtering, WAI-ARIA combobox keyboard logic, a pluggable `FontProvider`
    contract, a default Google Fonts provider with a bundled offline catalog, and
    an async `googleFontsApiProvider` backed by the live Google Fonts Developer API
    (with offline fallback).
  - `@font-family-input/react` — unstyled, composable React primitives
    (`Root`, `Trigger`, `Portal`, `Content`, `Search`, `List`, `Item`, `Empty`)
    with list virtualization via `@tanstack/react-virtual`, controlled +
    uncontrolled value support, and a `useFontInput` escape hatch.
  - `@font-family-input/vue` — the same primitives for Vue 3 (`FontInputRoot`,
    `FontInputTrigger`, …) with `v-model`, virtualization via
    `@tanstack/vue-virtual`, and a `useFontInput` composable.
  - `@font-family-input/preact` — the React primitives ported to Preact
    (`FontInput.Root`, …) with virtualization via `@tanstack/virtual-core`.
  - `@font-family-input/solid` — Solid primitives (`FontInput.Root`, …) with
    virtualization via `@tanstack/solid-virtual` and fine-grained reactivity.
  - `@font-family-input/svelte` — Svelte 5 (runes) primitives with `bind:value`
    and fixed-height list virtualization.
  - `@font-family-input/html` — a framework-agnostic `<font-family-input>` custom
    element wrapping the core, styleable via `::part(...)`, emitting a `change`
    event on selection. Ships a self-contained UMD build for CDN/`<script>` use
    (unpkg / jsdelivr).

### Patch Changes

- Updated dependencies [0eb161a]
  - @font-family-input/core@0.1.0
