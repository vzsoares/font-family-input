---
"@font-family-input/core": minor
"@font-family-input/react": minor
---

Initial release: a composable, headless, virtualized font-family picker.

- `@font-family-input/core` — framework-agnostic engine: reactive store, search
  filtering, WAI-ARIA combobox keyboard logic, a pluggable `FontProvider`
  contract, and a default Google Fonts provider with a bundled offline catalog.
- `@font-family-input/react` — unstyled, composable React primitives
  (`Root`, `Trigger`, `Portal`, `Content`, `Search`, `List`, `Item`, `Empty`)
  with list virtualization via `@tanstack/react-virtual`, controlled +
  uncontrolled value support, and a `useFontInput` escape hatch.
