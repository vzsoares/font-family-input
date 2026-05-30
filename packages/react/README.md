# @font-family-input/react

> Composable, unstyled, virtualized React primitives for `font-family-input`.

## Install

```bash
bun add @font-family-input/react @tanstack/react-virtual
```

## Usage

```tsx
import { FontInput } from "@font-family-input/react";
import { useState } from "react";

function FontPicker() {
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

Style via `className`, inline `style`, or `data-state` / `data-highlighted` / `data-selected` attributes.

## Docs

https://vzsoares.github.io/font-family-input/guide/react

## License

MIT
