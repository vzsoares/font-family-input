# @font-family-input/core

The framework-agnostic engine. You usually consume it through a framework
adapter, but you can build your own binding on top of it.

## `createFontInput(options)`

Creates a reactive store (the headless state machine).

```ts
import { createFontInput } from "@font-family-input/core";

const store = createFontInput({
  provider,         // FontProvider — defaults to googleFontsProvider()
  defaultValue,     // initial selected family
  onChange,         // (family) => void, fired on selection
  onOpenChange,     // (open) => void
  filter,           // override the search strategy
  loadOnHighlight,  // load font CSS as options are highlighted (default true)
});
```

### State

```ts
store.getState();
// { open, search, value, fonts, filtered, highlightedIndex, loading }
store.subscribe(() => { /* re-read getState() */ });
```

### Actions

`open` · `close` · `toggle` · `setSearch(q)` · `setValue(family)` (silent sync
for controlled usage) · `highlight(i)` · `highlightBy(delta)` · `highlightFirst`
· `highlightLast` · `select(family)` · `selectHighlighted` · `loadFont(family)`
· `destroy`.

## `handleComboboxKey(target, event)`

Pure WAI-ARIA combobox key logic, decoupled from the DOM. Returns `true` when
the key was handled (so callers can `preventDefault`). The store satisfies the
`KeyboardTarget` interface.

## Font loading

```ts
import { createGoogleFontLoader, DEFAULT_SYSTEM_FONTS } from "@font-family-input/core";

const loadFont = createGoogleFontLoader({ display: "swap" });
loadFont("Inter"); // injects a Google Fonts <link>, deduped, SSR-safe
```

System/generic families (`Arial`, `sans-serif`, …) are skipped automatically.

## Providers

`googleFontsProvider(options)` returns the default `FontProvider`. See
[Font Providers](./providers) for custom sources and the contract.
