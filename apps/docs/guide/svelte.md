# @font-family-input/svelte

Composable, unstyled Svelte 5 primitives built with runes.

## Install

```bash
bun add @font-family-input/svelte
```

## Components

All components are in `@font-family-input/svelte`. Use `bind:value` for two-way binding.

### `Root`

Provider + state owner. Wraps all other components.

| Prop | Type | Notes |
| --- | --- | --- |
| `bind:value` | `string` | Two-way controlled selection |
| `defaultValue` | `string` | Initial selection (uncontrolled) |
| `provider` | `FontProvider` | Font source. Defaults to the bundled Google Fonts provider |
| `filter` | `FontFilter` | Override search strategy |
| `loadOnHighlight` | `boolean` | Live preview on highlight (default `true`) |

Events: `onValueChange`, `onOpenChange`.

### `Trigger`

The button that shows the current value and opens the list. Passes all extra attributes through. Props: `placeholder`, `previewFont` (default `true`).

### `Portal`

Moves its children to `document.body` (or a custom `target` element).

### `Content`

Popup surface. Handles outside-click dismissal and auto-focuses the search input on open. Props: `forceMount`.

### `Search`

The filter input. Drives keyboard navigation. Prop: `placeholder`.

### `List`

Windowed listbox using **fixed-height virtualization** (no separate TanStack dep). Uses a `{#snippet children(font, index)}` render prop. Set a `max-height` to bound the scroll area.

| Prop | Default |
| --- | --- |
| `estimateSize` | `36` (px) |
| `overscan` | `8` |

### `Item`

A single option. **Must receive `font` (FontItem) and `index` from the `List` snippet.** Props: `previewFont` (default `true`).

### `Empty`

Shown when the filtered catalog is empty and loaded.

## Full example

```svelte
<script lang="ts">
  import { Root, Trigger, Content, Search, List, Item, Empty }
    from "@font-family-input/svelte";

  let font = $state("Inter");
</script>

<Root bind:value={font}>
  <Trigger class="trigger" />
  <Content class="content">
    <Search class="search" />
    <List class="list" style="max-height: 320px">
      {#snippet children(item, index)}
        <Item font={item} {index} class="option" />
      {/snippet}
    </List>
    <Empty class="empty">No fonts found</Empty>
  </Content>
</Root>
```

## Styling

Style via `class` / `style`. Hook into behavior via `data-*`:

| Attribute | On | Meaning |
| --- | --- | --- |
| `data-state` | Trigger, Content | `open` / `closed` |
| `data-highlighted` | Item | Active via keyboard or hover |
| `data-selected` | Item | Currently selected |
| `data-placeholder` | Trigger | Present when no value set |

## Note on virtualization

The Svelte adapter uses a simple fixed-height windowing approach without an external dependency. For best results set `estimateSize` to match your actual row height.
