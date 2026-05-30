# @font-family-input/vue

Composable, unstyled, virtualized Vue 3 primitives.

## Install

```bash
bun add @font-family-input/vue @tanstack/vue-virtual
```

## Components

All components are available as named exports. Provide props via attributes and use `v-model` for two-way binding.

### `FontInputRoot`

Provider + state owner. Wraps all other components.

| Prop | Type | Notes |
| --- | --- | --- |
| `v-model` | `string` | Two-way controlled selection |
| `defaultValue` | `string` | Initial selection (uncontrolled) |
| `provider` | `FontProvider` | Font source. Defaults to the bundled Google Fonts provider |
| `filter` | `FontFilter` | Override search strategy |
| `loadOnHighlight` | `boolean` | Live preview on highlight (default `true`) |

Emits: `update:modelValue`, `openChange`.

### `FontInputTrigger`

The button that shows the current value and opens the list. Props: `placeholder`, `previewFont` (renders the button text in the selected font, default `true`).

### `FontInputContent`

Popup surface. Handles outside-click dismissal and auto-focuses the search input on open. Unpositioned — position via CSS. Prop: `forceMount` to keep mounted for animations.

### `FontInputSearch`

The filter input. Drives keyboard navigation. Prop: `placeholder`.

### `FontInputList`

Virtualized listbox via `@tanstack/vue-virtual`. Uses a **render-prop scoped slot** (`{ font, index }`) rather than child components. Set a `max-height` to bound the virtualizer.

| Prop | Default |
| --- | --- |
| `estimateSize` | `36` (px) |
| `overscan` | `8` |

### `FontInputItem`

A single option. **Must receive `font` and `index` from the `FontInputList` scoped slot.** Props: `previewFont` (default `true`).

### `FontInputEmpty`

Shown when the filtered catalog is empty and loaded.

## Full example

```vue
<script setup lang="ts">
import {
  FontInputRoot, FontInputTrigger, FontInputContent,
  FontInputSearch, FontInputList, FontInputItem, FontInputEmpty,
} from "@font-family-input/vue";
import { ref } from "vue";

const font = ref("Inter");
</script>

<template>
  <FontInputRoot v-model="font">
    <FontInputTrigger class="trigger" />
    <FontInputContent class="content">
      <FontInputSearch class="search" />
      <FontInputList class="list" style="max-height: 320px">
        <template #default="{ font: item, index }">
          <FontInputItem :font="item" :index="index" class="option" />
        </template>
      </FontInputList>
      <FontInputEmpty class="empty">No fonts found</FontInputEmpty>
    </FontInputContent>
  </FontInputRoot>
</template>
```

## Styling

Style via `class` / `style` attributes. Hook into behavior via `data-*`:

| Attribute | On | Meaning |
| --- | --- | --- |
| `data-state` | Trigger, Content | `open` / `closed` |
| `data-highlighted` | Item | Active via keyboard or hover |
| `data-selected` | Item | Currently selected |
| `data-placeholder` | Trigger | Present when no value set |

## `useFontInput` composable

Access the store directly for fully custom markup:

```ts
import { useFontInput } from "@font-family-input/vue";
import { provide } from "vue";
import { FontInputKey } from "@font-family-input/vue";

const ctx = useFontInput({ onChange: (v) => emit("update:modelValue", v) });
provide(FontInputKey, ctx);
// ctx.store, ctx.state (reactive), ctx.ids
```
