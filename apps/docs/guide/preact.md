# @font-family-input/preact

Composable, unstyled Preact primitives — the same API as the React adapter.

## Install

```bash
bun add @font-family-input/preact
```

## Primitives

All primitives are available namespaced (`FontInput.Root`) or as named exports. The API mirrors `@font-family-input/react`; replace `react` with `preact` in your imports.

### `Root`

Provider + state owner.

| Prop | Type | Notes |
| --- | --- | --- |
| `value` | `string` | Controlled selection |
| `defaultValue` | `string` | Initial selection (uncontrolled) |
| `onValueChange` | `(family: string) => void` | Fired on selection |
| `provider` | `FontProvider` | Defaults to bundled Google Fonts |
| `filter` | `FontFilter` | Override search strategy |

### Other components

`Trigger`, `Portal`, `Content`, `Search`, `List`, `Item`, `Empty` — same props as the React adapter. `List` uses `@tanstack/virtual-core` directly (no framework-specific binding needed).

## Full example

```tsx
import { FontInput } from "@font-family-input/preact";
import { useState } from "preact/hooks";

function FontPicker() {
  const [font, setFont] = useState("Inter");

  return (
    <FontInput.Root value={font} onValueChange={setFont}>
      <FontInput.Trigger class="trigger" />
      <FontInput.Portal>
        <FontInput.Content class="content">
          <FontInput.Search class="search" />
          <FontInput.List class="list" style={{ maxHeight: 320 }}>
            {(item) => <FontInput.Item class="option">{item.family}</FontInput.Item>}
          </FontInput.List>
          <FontInput.Empty>No fonts found</FontInput.Empty>
        </FontInput.Content>
      </FontInput.Portal>
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
