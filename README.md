# font-family-input

> Composable, headless, virtualized font-family pickers for the web — one core, every framework, any font source.

`font-family-input` extracts the font picker into a set of framework-agnostic npm packages. All the logic lives in a headless core; each framework gets a thin, unstyled adapter you compose and style yourself.

## Why

- **🧩 Composable** — assemble the picker from unstyled primitives (`Root`, `Trigger`, `Content`, `Search`, `List`, `Item`, `Empty`) with your own markup.
- **🎨 Headless** — ships behavior, ARIA, and `data-*` hooks only. Zero CSS.
- **⚡ Virtualized** — powered by [TanStack Virtual](https://tanstack.com/virtual); large catalogs stay smooth.
- **🔌 Any font source** — Google Fonts works out of the box and offline. Implement the `FontProvider` contract for self-hosted, Bunny, Adobe, anything.
- **♿ Accessible** — full WAI-ARIA combobox pattern (arrows, type-ahead, Home/End, Enter/Escape).
- **🪶 Framework-agnostic** — a dependency-free core with thin adapters.

## Packages

| Package | Description | Status |
| ------- | ----------- | ------ |
| [`@font-family-input/core`](./packages/core) | Headless engine: store, filter, keyboard, provider contract, Google + live-API providers | ✅ v0 |
| [`@font-family-input/react`](./packages/react) | Composable, unstyled, virtualized React primitives | ✅ v0 |
| [`@font-family-input/vue`](./packages/vue) | Composable, unstyled, virtualized Vue 3 primitives | ✅ v0 |
| [`@font-family-input/preact`](./packages/preact) | Composable, unstyled, virtualized Preact primitives | ✅ v0 |
| [`@font-family-input/solid`](./packages/solid) | Composable, unstyled, virtualized Solid primitives | ✅ v0 |
| [`@font-family-input/svelte`](./packages/svelte) | Composable, unstyled, virtualized Svelte 5 primitives | ✅ v0 |
| [`@font-family-input/html`](./packages/html) | `<font-family-input>` Web Component, CDN-ready UMD build | ✅ v0 |
| `@font-family-input/angular` | Angular adapter | 🔜 planned |

## Quick start

### React

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
            {(item) => <FontInput.Item key={item.family}>{item.family}</FontInput.Item>}
          </FontInput.List>
          <FontInput.Empty>No fonts found</FontInput.Empty>
        </FontInput.Content>
      </FontInput.Portal>
    </FontInput.Root>
  );
}
```

### Vue 3

```bash
bun add @font-family-input/vue @tanstack/vue-virtual
```

```vue
<script setup lang="ts">
import { FontInputRoot, FontInputTrigger, FontInputContent, FontInputSearch, FontInputList, FontInputItem, FontInputEmpty } from "@font-family-input/vue";
import { ref } from "vue";
const font = ref("");
</script>

<template>
  <FontInputRoot v-model="font">
    <FontInputTrigger />
    <FontInputContent>
      <FontInputSearch />
      <FontInputList style="max-height: 320px">
        <template #default="{ font: item, index }">
          <FontInputItem :font="item" :index="index" />
        </template>
      </FontInputList>
      <FontInputEmpty>No fonts found</FontInputEmpty>
    </FontInputContent>
  </FontInputRoot>
</template>
```

### Svelte 5

```bash
bun add @font-family-input/svelte
```

```svelte
<script lang="ts">
  import { Root, Trigger, Content, Search, List, Item, Empty } from "@font-family-input/svelte";
  let font = $state("");
</script>

<Root bind:value={font}>
  <Trigger />
  <Content>
    <Search />
    <List>
      {#snippet children(item, index)}
        <Item {font={item}} {index} />
      {/snippet}
    </List>
    <Empty>No fonts found</Empty>
  </Content>
</Root>
```

### Solid

```bash
bun add @font-family-input/solid @tanstack/solid-virtual
```

```tsx
import { FontInput } from "@font-family-input/solid";

function FontPicker() {
  const [font, setFont] = createSignal("");
  return (
    <FontInput.Root value={font()} onValueChange={setFont}>
      <FontInput.Trigger />
      <FontInput.Content>
        <FontInput.Search />
        <FontInput.List style={{ "max-height": "320px" }}>
          {(item) => <FontInput.Item>{item.family}</FontInput.Item>}
        </FontInput.List>
        <FontInput.Empty>No fonts found</FontInput.Empty>
      </FontInput.Content>
    </FontInput.Root>
  );
}
```

### Preact

```bash
bun add @font-family-input/preact
```

```tsx
import { FontInput } from "@font-family-input/preact";
import { useState } from "preact/hooks";

function FontPicker() {
  const [font, setFont] = useState("");
  return (
    <FontInput.Root value={font} onValueChange={setFont}>
      <FontInput.Trigger />
      <FontInput.Content>
        <FontInput.Search />
        <FontInput.List style={{ maxHeight: 320 }}>
          {(item) => <FontInput.Item>{item.family}</FontInput.Item>}
        </FontInput.List>
        <FontInput.Empty>No fonts found</FontInput.Empty>
      </FontInput.Content>
    </FontInput.Root>
  );
}
```

### Web Component / Plain HTML

```bash
bun add @font-family-input/html
```

```ts
import { defineFontFamilyInput } from "@font-family-input/html";
defineFontFamilyInput();
```

```html
<font-family-input value="Inter" placeholder="Pick a font"></font-family-input>
```

Or straight from a CDN — no build step needed:

```html
<script src="https://unpkg.com/@font-family-input/html"></script>
<script>FontFamilyInput.defineFontFamilyInput();</script>

<font-family-input value="Inter" placeholder="Pick a font"></font-family-input>
```

### Custom font source

```ts
import type { FontProvider } from "@font-family-input/core";

// Self-hosted / @font-face already loaded on the page
const myProvider: FontProvider = {
  listFonts: () => [{ family: "My Brand Sans" }, { family: "My Brand Serif" }],
  loadFont: () => {},
};
```

Or the full live Google Fonts catalog (≈1,800 families) with an API key:

```ts
import { googleFontsApiProvider } from "@font-family-input/core";
const provider = googleFontsApiProvider({ apiKey: import.meta.env.VITE_GF_KEY });
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

See [`AGENTS.md`](./AGENTS.md) for the contributor quality gate and [`PLAN.md`](./PLAN.md) for the architecture and roadmap.

### Releasing

Versioning and publishing use [Changesets](https://github.com/changesets/changesets):

```bash
bun run changeset   # describe a change
bun run version     # bump versions + changelogs
bun run release     # build + publish to npm
```

## License

MIT
