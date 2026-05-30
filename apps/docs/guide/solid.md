# @font-family-input/solid

Composable, unstyled, virtualized Solid primitives with fine-grained reactivity.

## Install

```bash
bun add @font-family-input/solid @tanstack/solid-virtual
```

## Primitives

All primitives are available namespaced (`FontInput.Root`) or as named exports (`Root`).

### `Root`

Provider + state owner. Renders no DOM.

| Prop | Type | Notes |
| --- | --- | --- |
| `value` | `string` | Controlled selection |
| `defaultValue` | `string` | Initial selection (uncontrolled) |
| `onValueChange` | `(family: string) => void` | Fired on selection |
| `onOpenChange` | `(open: boolean) => void` | |
| `provider` | `FontProvider` | Defaults to the bundled Google Fonts provider |
| `filter` | `FontFilter` | Override search strategy |
| `loadOnHighlight` | `boolean` | Live preview on highlight (default `true`) |

### `Trigger`

The button that shows the current value and opens the list. Props: `placeholder`, `previewFont` (default `true`).

### `Portal`

Renders its children via Solid's `<Portal>`. Prop: `mount` (target node, defaults to `document.body`).

### `Content`

Popup surface. Outside-click dismissal and auto-focuses search on open. Prop: `forceMount`.

### `Search`

The filter input. Drives keyboard navigation. Prop: `placeholder`.

### `List`

Virtualized listbox via `@tanstack/solid-virtual`. Children are a render function `(font, index) => JSX`. Set `max-height`.

### `Item`

A single option (`role="option"`). Reads its font/index from the surrounding `List`. Props: `previewFont` (default `true`).

### `Empty`

Shown when the filtered catalog is empty and loaded.

## Full example

```tsx
import { FontInput } from "@font-family-input/solid";
import { createSignal } from "solid-js";

function FontPicker() {
  const [font, setFont] = createSignal("Inter");

  return (
    <FontInput.Root value={font()} onValueChange={setFont}>
      <FontInput.Trigger class="trigger" />
      <FontInput.Content class="content">
        <FontInput.Search class="search" />
        <FontInput.List class="list" style={{ "max-height": "320px" }}>
          {(item) => <FontInput.Item class="option">{item.family}</FontInput.Item>}
        </FontInput.List>
        <FontInput.Empty class="empty">No fonts found</FontInput.Empty>
      </FontInput.Content>
    </FontInput.Root>
  );
}
```

## Styling hooks

| Attribute | On | Meaning |
| --- | --- | --- |
| `data-state` | Trigger, Content | `open` / `closed` |
| `data-highlighted` | Item | Active via keyboard or hover |
| `data-selected` | Item | Currently selected |
| `data-placeholder` | Trigger | Present when no value set |
