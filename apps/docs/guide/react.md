# @font-family-input/react

Composable, unstyled, virtualized React primitives.

## Primitives

All primitives are available both namespaced (`FontInput.Root`) and as named
exports (`Root`). They forward refs and spread extra props to their DOM node.

### `Root`

State owner + context provider. Renders no DOM.

| Prop              | Type                        | Notes                                  |
| ----------------- | --------------------------- | -------------------------------------- |
| `value`           | `string`                    | Controlled selection                   |
| `defaultValue`    | `string`                    | Uncontrolled initial selection         |
| `onValueChange`   | `(family: string) => void`  | Fired on selection                     |
| `onOpenChange`    | `(open: boolean) => void`   |                                        |
| `provider`        | `FontProvider`              | Defaults to the Google Fonts provider  |
| `filter`          | `FontFilter`                | Override search                        |
| `loadOnHighlight` | `boolean`                   | Live preview on highlight (default on) |

### `Trigger`

The button that shows the current value and toggles the list. `placeholder`,
`previewFont` (render the button in the selected font), and a render-prop
`children` are supported. Wires `aria-haspopup`, `aria-expanded`, and combobox
keys.

### `Portal`

Renders `Content` into `document.body` (or a custom `container`). SSR-safe.

### `Content`

The popup surface. Mounts only while open (`forceMount` to keep it for
animations). Handles outside-click dismissal and focuses `Search` on open.
**Unstyled and unpositioned** — position it yourself.

### `Search`

The filter textbox. Has `role="combobox"`, drives keyboard navigation, and wires
`aria-activedescendant` to the highlighted option.

### `List`

The virtualized listbox (`role="listbox"`). Render-prop children:

```tsx
<FontInput.List estimateSize={36} overscan={8} style={{ maxHeight: 320 }}>
  {(item, index) => <FontInput.Item key={item.family}>{item.family}</FontInput.Item>}
</FontInput.List>
```

Set a `max-height` so the virtualizer has a viewport to bound.

### `Item`

A single option (`role="option"`). Reads its font/index from `List`. Selects on
click, highlights on hover. Exposes `data-selected` and `data-highlighted`.

### `Empty`

Renders its children only when the filtered catalog is empty (and loaded).

## `useFontInput(props)`

The escape hatch. Returns the store + context value so you can render fully
custom markup. This is what `Root` uses internally.

## Styling hooks

| Attribute          | On            | Meaning                  |
| ------------------ | ------------- | ------------------------ |
| `data-state`       | Trigger/Content | `open` / `closed`      |
| `data-highlighted` | Item          | active (keyboard/hover)  |
| `data-selected`    | Item          | currently selected       |
| `data-placeholder` | Trigger       | present when no value    |
