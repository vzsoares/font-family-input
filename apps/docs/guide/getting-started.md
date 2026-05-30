# Getting Started

`font-family-input` is a composable, **headless** font-family picker. The logic
lives in a framework-agnostic core; each framework gets a thin, unstyled adapter.

## Install

::: code-group

```bash [bun]
bun add @font-family-input/react @tanstack/react-virtual
```

```bash [npm]
npm install @font-family-input/react @tanstack/react-virtual
```

:::

`@font-family-input/react` depends on `@font-family-input/core` and lists
`react`, `react-dom`, and `@tanstack/react-virtual` as peer dependencies.

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

Everything renders unstyled. Add your own CSS via `className`, inline `style`, or
the `data-*` attributes the primitives expose (`data-state`, `data-highlighted`,
`data-selected`).

## What's next

- [Philosophy](./philosophy) — why headless + composable.
- [@font-family-input/react](./react) — every primitive and prop.
- [Font Providers](./providers) — swap Google for any source.
