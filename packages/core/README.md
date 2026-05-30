# @font-family-input/core

> Framework-agnostic headless engine for `font-family-input`.

Contains all the logic — state machine, search filter, WAI-ARIA combobox keyboard handling, font loader, and the `FontProvider` contract. No framework dependencies.

## Install

```bash
bun add @font-family-input/core
```

You usually don't depend on this directly; framework adapters re-export everything you need. Use it directly when building a custom adapter.

## Key exports

```ts
// Provider contract
interface FontProvider {
  listFonts(): FontItem[] | Promise<FontItem[]>;
  loadFont(family: string): void | Promise<void>;
}

// Default provider — bundled curated list, offline
import { googleFontsProvider } from "@font-family-input/core";

// Live Google Fonts API provider (≈1,800 families, requires API key)
import { googleFontsApiProvider } from "@font-family-input/core";
const provider = googleFontsApiProvider({ apiKey: "YOUR_KEY" });

// Headless store — use to build your own adapter
import { createFontInput } from "@font-family-input/core";
const store = createFontInput({ provider, onChange: setFont });
store.getState(); // { open, search, value, filtered, highlightedIndex, loading }

// Combobox keyboard handler (pure, no DOM dependency)
import { handleComboboxKey } from "@font-family-input/core";
```

## Docs

https://vzsoares.github.io/font-family-input/guide/core

## License

MIT
