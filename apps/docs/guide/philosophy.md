# Philosophy

## Headless

The packages ship **behavior, accessibility, and `data-*` hooks** — never CSS.
You own the markup and the look. This keeps the picker at home in any design
system, from Tailwind to plain CSS.

## Composable

Instead of one monolithic `<FontPicker>` with dozens of props, you assemble the
picker from small primitives:

```
Root        state owner + provider (no DOM)
 ├ Trigger  the button that shows the selection and opens the list
 └ Portal   optional — render the popup elsewhere in the DOM
    └ Content   the popup surface (outside-click + focus handling)
       ├ Search the filter textbox (drives keyboard nav)
       ├ List   the virtualized listbox
       │  └ Item a single option
       └ Empty  shown when nothing matches
```

Need a custom layout? Use `useFontInput()` (React) directly and render whatever
you want against the store.

## One core, many frameworks

All logic — state machine, filtering, keyboard handling, font loading, the
provider contract — lives in `@font-family-input/core`, which has **no framework
dependencies**. Framework packages are thin bindings. This is what lets the same
behavior ship to React, Vue, Angular, and a Web Component.

## Any font source

Google Fonts is the default, but it's just one implementation of the
`FontProvider` contract. Point the picker at self-hosted fonts, Bunny Fonts,
Adobe, or your own catalog by implementing two methods. See
[Font Providers](./providers).
