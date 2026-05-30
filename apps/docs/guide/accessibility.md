# Accessibility

The primitives implement the
[WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
with `aria-activedescendant`.

## Roles & attributes

- `Trigger` — `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`.
- `Search` — `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`,
  `aria-controls`, and `aria-activedescendant` pointing at the active option.
- `List` — `role="listbox"`.
- `Item` — `role="option"`, `aria-selected`.

## Keyboard

| Key                 | Behavior                                  |
| ------------------- | ----------------------------------------- |
| `ArrowDown`/`ArrowUp` | Open (when closed) / move highlight      |
| `Home` / `End`      | Jump to first / last option               |
| `Enter`             | Select the highlighted option             |
| `Escape`            | Close the list                            |
| `Tab`               | Close and move focus on                   |
| Typing              | Filters the list                          |

Focus stays on the search textbox throughout; options are referenced via
`aria-activedescendant` rather than being focused individually, which is the
correct pattern for a filtered listbox and works with virtualization.

## Notes

- Focus moves to `Search` when the popup opens.
- Outside clicks dismiss the popup.
- Because the picker is headless, ensure your styles provide a visible focus
  indicator and sufficient contrast for the highlighted/selected states
  (`data-highlighted`, `data-selected`).
