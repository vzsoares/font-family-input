import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { useFontInputContext, useItemContext } from "../context";
import { mergeRefs } from "../internal";

export interface FontInputItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Defaults to the font family name. */
  children?: ReactNode;
  /** Render the option text in its own font for preview. Default true. */
  previewFont?: boolean;
}

/**
 * A single selectable option (`role="option"`). Reads its font/index from the
 * surrounding `<List>`. Selects on click, highlights on hover.
 *
 * a11y: this implements the WAI-ARIA combobox + `aria-activedescendant`
 * pattern. Keyboard interaction lives on `<Search>` (the textbox), so options
 * are intentionally not individually focusable and carry no key handlers; and
 * there is no semantic element for `role="option"` outside `<select>`. The
 * corresponding a11y lint rules are disabled for `primitives/**` in biome.json.
 */
export const Item = forwardRef<HTMLDivElement, FontInputItemProps>(function Item(
  { children, previewFont = true, onClick, onMouseEnter, style, ...rest },
  ref,
) {
  const { store, state, ids } = useFontInputContext("Item");
  const { font, index } = useItemContext("Item");

  const selected = state.value === font.family;
  const highlighted = state.highlightedIndex === index;

  return (
    <div
      ref={ref ? mergeRefs(ref) : undefined}
      id={ids.option(index)}
      role="option"
      aria-selected={selected}
      data-selected={selected ? "" : undefined}
      data-highlighted={highlighted ? "" : undefined}
      style={previewFont ? { fontFamily: font.family, ...style } : style}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) store.select(font.family);
      }}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        store.highlight(index);
      }}
      {...rest}
    >
      {children ?? font.family}
    </div>
  );
});
