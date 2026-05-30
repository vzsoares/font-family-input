# @font-family-input/solid

> Composable, unstyled, virtualized Solid primitives for `font-family-input`.

## Install

```bash
bun add @font-family-input/solid @tanstack/solid-virtual
```

## Usage

```tsx
import { FontInput } from "@font-family-input/solid";
import { createSignal } from "solid-js";

function FontPicker() {
  const [font, setFont] = createSignal("Inter");
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

## Docs

https://vzsoares.github.io/font-family-input/guide/solid

## License

MIT
