import type { FontItem } from "@font-family-input/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { type HTMLAttributes, type ReactNode, forwardRef, useEffect, useRef } from "react";
import { ItemProvider, useFontInputContext } from "../context";
import { mergeRefs } from "../internal";

export interface FontInputListProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Render a single option. Wrapped + positioned by the virtualizer. */
  children: (font: FontItem, index: number) => ReactNode;
  /** Estimated row height in px (drives virtualization). Default 36. */
  estimateSize?: number;
  /** Extra rows to render beyond the viewport. Default 8. */
  overscan?: number;
}

/**
 * Virtualized listbox. Owns the scroll container and renders only the visible
 * options via `@tanstack/react-virtual`. Set a `max-height` via CSS to bound it.
 */
export const List = forwardRef<HTMLDivElement, FontInputListProps>(function List(
  { children, estimateSize = 36, overscan = 8, style, ...rest },
  ref,
) {
  const { state, ids } = useFontInputContext("List");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: state.filtered.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  // Keep the highlighted option in view during keyboard navigation.
  useEffect(() => {
    if (state.highlightedIndex >= 0) {
      virtualizer.scrollToIndex(state.highlightedIndex);
    }
  }, [state.highlightedIndex, virtualizer]);

  const items = virtualizer.getVirtualItems();

  return (
    <div
      ref={mergeRefs(ref, scrollRef)}
      id={ids.listbox}
      role="listbox"
      style={{ overflow: "auto", ...style }}
      {...rest}
    >
      <div style={{ height: virtualizer.getTotalSize(), position: "relative", width: "100%" }}>
        {items.map((virtualItem) => {
          const font = state.filtered[virtualItem.index];
          if (!font) return null;
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ItemProvider value={{ font, index: virtualItem.index }}>
                {children(font, virtualItem.index)}
              </ItemProvider>
            </div>
          );
        })}
      </div>
    </div>
  );
});
