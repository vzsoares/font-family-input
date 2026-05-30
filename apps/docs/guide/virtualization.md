# Virtualization

Font catalogs can be large (the full Google Fonts list is ~1,800 families).
Rendering every option would be slow, so `List` is virtualized — only the rows
in (and near) the viewport are mounted.

## How it works

The React `List` primitive uses
[`@tanstack/react-virtual`](https://tanstack.com/virtual). It owns the scroll
container, measures rows, and renders just the visible window plus an overscan
buffer. As you scroll or arrow through the list, rows are recycled.

```tsx
<FontInput.List
  estimateSize={36}   // estimated row height in px
  overscan={8}        // extra rows rendered beyond the viewport
  style={{ maxHeight: 320 }}
>
  {(item) => <FontInput.Item key={item.family}>{item.family}</FontInput.Item>}
</FontInput.List>
```

::: tip
Give `List` a bounded height (e.g. `max-height`) so the virtualizer has a
viewport to measure against.
:::

## Keyboard + virtualization

Arrowing past the visible window scrolls the highlighted option into view
automatically (`scrollToIndex`), and the highlighted row is always mounted so
`aria-activedescendant` resolves to a real element.

## Why a provider per framework?

Virtualization needs framework-specific DOM measurement and rendering, so each
adapter uses the matching TanStack adapter (`@tanstack/react-virtual`,
`@tanstack/vue-virtual`, …) rather than a shared implementation.
