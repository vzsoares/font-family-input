# @font-family-input/preact

> Composable, unstyled Preact primitives for `font-family-input`.

Same API as `@font-family-input/react` — replace `react` with `preact` in your imports.

## Install

```bash
bun add @font-family-input/preact
```

## Usage

```tsx
import { FontInput } from "@font-family-input/preact";
import { useState } from "preact/hooks";

function FontPicker() {
  const [font, setFont] = useState("Inter");
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

## Docs

https://vzsoares.github.io/font-family-input/guide/preact

## License

MIT
