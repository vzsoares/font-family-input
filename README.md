# font-family-input

> Composable, headless, virtualized font-family pickers for the web — one core, every framework, any font source.

`font-family-input` extracts the font picker into a set of framework-agnostic
npm packages. All the logic lives in a headless core; each framework gets a thin,
unstyled adapter you compose and style yourself.

> [!NOTE]
> **Early / initial phase.** The `core` and `react` packages are functional and
> tested; the API may still change before a stable `1.0`. Vue, Angular, and a Web
> Component are on the roadmap.

## Why

- **🧩 Composable** — assemble the picker from unstyled primitives (`Root`,
  `Trigger`, `Content`, `Search`, `List`, `Item`, `Empty`) with your own markup.
- **🎨 Headless** — ships behavior, ARIA, and `data-*` hooks only. Zero CSS.
- **⚡ Virtualized** — powered by [TanStack Virtual](https://tanstack.com/virtual);
  large catalogs stay smooth.
- **🔌 Any font source** — Google Fonts works out of the box and offline.
  Implement the `FontProvider` contract for self-hosted, Bunny, Adobe, anything.
- **♿ Accessible** — full WAI-ARIA combobox pattern (arrows, type-ahead,
  Home/End, Enter/Escape).
- **🪶 Framework-agnostic** — a dependency-free core with thin adapters.

## Packages

| Package | Description | Status |
| ------- | ----------- | ------ |
| [`@font-family-input/core`](./packages/core) | Headless engine: store, filter, keyboard, provider contract, Google + live-API providers | ✅ initial |
| [`@font-family-input/react`](./packages/react) | Composable, unstyled, virtualized React primitives | ✅ initial |
| [`@font-family-input/vue`](./packages/vue) | Composable, unstyled, virtualized Vue 3 primitives | ✅ initial |
| [`@font-family-input/preact`](./packages/preact) | Composable, unstyled, virtualized Preact primitives | ✅ initial |
| [`@font-family-input/html`](./packages/html) | `<font-family-input>` Web Component (CDN-ready) | ✅ initial |
| `@font-family-input/angular` | Angular adapter | 🔜 planned |
| `@font-family-input/svelte` | Svelte adapter | 🔜 planned |
| `@font-family-input/solid` | Solid adapter | 🔜 planned |

## Quick start (React)

```bash
bun add @font-family-input/react @tanstack/react-virtual
```

```tsx
import { FontInput } from "@font-family-input/react";
import { useState } from "react";

export function FontPicker() {
  const [font, setFont] = useState("");

  return (
    <FontInput.Root value={font} onValueChange={setFont}>
      <FontInput.Trigger />
      <FontInput.Portal>
        <FontInput.Content className="popover">
          <FontInput.Search />
          <FontInput.List style={{ maxHeight: 320 }}>
            {(item) => (
              <FontInput.Item key={item.family}>{item.family}</FontInput.Item>
            )}
          </FontInput.List>
          <FontInput.Empty>No fonts found</FontInput.Empty>
        </FontInput.Content>
      </FontInput.Portal>
    </FontInput.Root>
  );
}
```

Everything renders unstyled — style it via `className`, inline `style`, or the
`data-state` / `data-highlighted` / `data-selected` attributes.

### Custom font source

```ts
import type { FontProvider } from "@font-family-input/core";

const myProvider: FontProvider = {
  listFonts: () => [{ family: "My Brand Sans" }, { family: "My Brand Serif" }],
  loadFont: () => {}, // already loaded via @font-face
};
```

Or fetch the full live Google Fonts catalog (≈1,800 families) with an API key —
falls back to the bundled list on error:

```ts
import { googleFontsApiProvider } from "@font-family-input/core";

const provider = googleFontsApiProvider({ apiKey: import.meta.env.VITE_GF_KEY });
```

### Other frameworks

```ts
// Vue
import { FontInputRoot, FontInputTrigger /* … */ } from "@font-family-input/vue";

// Preact
import { FontInput } from "@font-family-input/preact";

// Plain HTML / any framework — a custom element
import { defineFontFamilyInput } from "@font-family-input/html";
defineFontFamilyInput();
// <font-family-input value="Inter"></font-family-input>
```

### From a CDN (no build step)

The Web Component ships a self-contained UMD bundle, so it works straight from
[unpkg](https://unpkg.com) or [jsDelivr](https://www.jsdelivr.com):

```html
<script src="https://unpkg.com/@font-family-input/html"></script>
<script>
  FontFamilyInput.defineFontFamilyInput();
</script>

<font-family-input value="Inter" placeholder="Pick a font"></font-family-input>
```

Or as an ES module:

```html
<script type="module">
  import { defineFontFamilyInput } from "https://unpkg.com/@font-family-input/html?module";
  defineFontFamilyInput();
</script>
```

## Documentation & live preview

- **Docs + home:** https://vzsoares.github.io/font-family-input/
- **Live playground:** https://vzsoares.github.io/font-family-input/preview/

## Development

This is a [Bun](https://bun.sh) workspaces monorepo.

```bash
bun install         # install everything
bun run build       # build all publishable packages
bun run typecheck   # type-check every package
bun run test        # unit tests (Vitest)
bun run test:e2e    # end-to-end tests (Playwright)
bunx biome check .  # lint + format

bun run docs:dev        # run the docs site locally
bun run playground:dev  # run the playground locally
```

See [`AGENTS.md`](./AGENTS.md) for the contributor quality gate and
[`PLAN.md`](./PLAN.md) for the architecture and roadmap.

### Releasing

Versioning and publishing use [Changesets](https://github.com/changesets/changesets):

```bash
bun run changeset   # describe a change
bun run version     # bump versions + changelogs
bun run release     # build + publish to npm
```

## License

MIT
