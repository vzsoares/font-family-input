# Font Providers

A provider is how the picker discovers fonts and loads them for rendering. The
default is Google Fonts, but the contract is small enough to point anywhere.

## The contract

```ts
interface FontItem {
  family: string;
  category?: "serif" | "sans-serif" | "display" | "handwriting" | "monospace";
}

interface FontProvider {
  listFonts(): FontItem[] | Promise<FontItem[]>; // the catalog (sync or async)
  loadFont(family: string): void | Promise<void>; // inject CSS to render it
}
```

## Default: Google Fonts

```ts
import { googleFontsProvider } from "@font-family-input/core";

googleFontsProvider();                       // bundled curated list, offline
googleFontsProvider({ display: "optional" }); // tune font-display
googleFontsProvider({ fonts: myFullCatalog }); // your own list, Google loader
```

It serves a bundled, curated catalog (no API key, works offline) and lazily
injects Google Fonts stylesheets, skipping system/generic families.

## Custom source

Anything satisfying `FontProvider` works — self-hosted, Bunny Fonts, Adobe, etc.

```ts
const bunnyProvider: FontProvider = {
  listFonts: async () => {
    const res = await fetch("https://fonts.bunny.net/list");
    return Object.keys(await res.json()).map((family) => ({ family }));
  },
  loadFont: (family) => {
    const id = `bunny-${family}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.bunny.net/css?family=${encodeURIComponent(family)}`;
    document.head.appendChild(link);
  },
};
```

Pass it to `Root` (React) or `createFontInput` (core):

```tsx
<FontInput.Root provider={bunnyProvider}>…</FontInput.Root>
```

## Self-hosted (`@font-face`)

If your fonts are already declared via `@font-face`, `loadFont` can be a no-op:

```ts
const localProvider: FontProvider = {
  listFonts: () => [{ family: "My Brand Sans" }, { family: "My Brand Serif" }],
  loadFont: () => {}, // already available on the page
};
```
