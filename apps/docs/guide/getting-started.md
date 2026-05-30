# Getting Started

`font-family-input` is a composable, **headless** font-family picker. The logic lives in a framework-agnostic core; each framework gets a thin, unstyled adapter.

## Install

Pick the adapter that matches your framework. All adapters include `@font-family-input/core` as a dependency.

::: code-group

```bash [React]
bun add @font-family-input/react @tanstack/react-virtual
```

```bash [Vue]
bun add @font-family-input/vue @tanstack/vue-virtual
```

```bash [Svelte]
bun add @font-family-input/svelte
```

```bash [Solid]
bun add @font-family-input/solid @tanstack/solid-virtual
```

```bash [Preact]
bun add @font-family-input/preact
```

```bash [HTML / Web Component]
bun add @font-family-input/html
# or from a CDN — no install needed
```

:::

## Quick start (React)

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

Everything renders unstyled. Add your own CSS via `className`, inline `style`, or the `data-*` attributes the primitives expose (`data-state`, `data-highlighted`, `data-selected`).

## Quick start (Vue 3)

```vue
<script setup lang="ts">
import {
  FontInputRoot, FontInputTrigger, FontInputContent,
  FontInputSearch, FontInputList, FontInputItem, FontInputEmpty,
} from "@font-family-input/vue";
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

## Quick start (Svelte 5)

```svelte
<script lang="ts">
  import { Root, Trigger, Content, Search, List, Item, Empty }
    from "@font-family-input/svelte";
  let font = $state("");
</script>

<Root bind:value={font}>
  <Trigger />
  <Content>
    <Search />
    <List style="max-height: 320px">
      {#snippet children(item, index)}
        <Item font={item} {index} />
      {/snippet}
    </List>
    <Empty>No fonts found</Empty>
  </Content>
</Root>
```

## Quick start (Solid)

```tsx
import { FontInput } from "@font-family-input/solid";
import { createSignal } from "solid-js";

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

## Quick start (Web Component)

Register once, then use the element anywhere:

```ts
import { defineFontFamilyInput } from "@font-family-input/html";
defineFontFamilyInput();
```

```html
<font-family-input value="Inter" placeholder="Pick a font"></font-family-input>
```

Or from a CDN — no build step at all:

```html
<script src="https://unpkg.com/@font-family-input/html"></script>
<script>FontFamilyInput.defineFontFamilyInput();</script>

<font-family-input value="Inter"></font-family-input>
```

## What's next

- [Philosophy](./philosophy) — why headless + composable.
- [@font-family-input/react](./react) — every React primitive and prop.
- [Font Providers](./providers) — swap Google for any source.
- [Accessibility](./accessibility) — keyboard nav and ARIA.
