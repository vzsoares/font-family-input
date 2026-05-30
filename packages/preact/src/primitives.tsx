import { handleComboboxKey } from "@font-family-input/core";
import type { ComponentChildren, JSX } from "preact";
import { createPortal } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";
import { FontInputProvider, ItemProvider, useFontInputContext, useItemContext } from "./context";
import { comboboxTarget } from "./internal";
import { type UseFontInputProps, useFontInput } from "./useFontInput";
import { useVirtualizer } from "./useVirtualizer";

export interface RootProps extends UseFontInputProps {
  children: ComponentChildren;
}

export function Root({ children, ...props }: RootProps): JSX.Element {
  const ctx = useFontInput(props);
  return <FontInputProvider value={ctx}>{children}</FontInputProvider>;
}

export interface TriggerProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, "children"> {
  placeholder?: string;
  previewFont?: boolean;
  children?: ComponentChildren;
}

export function Trigger({
  placeholder = "Select font…",
  previewFont = true,
  children,
  style,
  ...rest
}: TriggerProps): JSX.Element {
  const { store, state, ids, triggerRef } = useFontInputContext("Trigger");
  return (
    <button
      type="button"
      ref={triggerRef}
      id={ids.trigger}
      aria-haspopup="listbox"
      aria-expanded={state.open}
      aria-controls={state.open ? ids.listbox : undefined}
      data-state={state.open ? "open" : "closed"}
      data-placeholder={state.value ? undefined : ""}
      style={previewFont && state.value ? { fontFamily: state.value, ...(style as object) } : style}
      onClick={() => store.toggle()}
      onKeyDown={(e) => {
        if (handleComboboxKey(comboboxTarget(store), e)) e.preventDefault();
      }}
      {...rest}
    >
      {children ?? (state.value || placeholder)}
    </button>
  );
}

export interface PortalProps {
  children: ComponentChildren;
  container?: Element | null;
}

export function Portal({ children, container }: PortalProps): JSX.Element | null {
  if (typeof document === "undefined") return null;
  return <>{createPortal(children, container ?? document.body)}</>;
}

export interface ContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
}

export function Content({
  forceMount = false,
  children,
  ...rest
}: ContentProps): JSX.Element | null {
  const { store, state, contentRef, triggerRef, inputRef } = useFontInputContext("Content");

  useEffect(() => {
    if (state.open) inputRef.current?.focus();
  }, [state.open, inputRef]);

  useEffect(() => {
    if (!state.open) return;
    function onDown(event: PointerEvent) {
      const t = event.target as Node | null;
      if (t && !contentRef.current?.contains(t) && !triggerRef.current?.contains(t)) {
        store.close();
      }
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [state.open, store, contentRef, triggerRef]);

  if (!state.open && !forceMount) return null;
  return (
    <div
      ref={contentRef}
      data-state={state.open ? "open" : "closed"}
      hidden={!state.open && forceMount ? true : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}

export type SearchProps = Omit<JSX.HTMLAttributes<HTMLInputElement>, "value" | "onChange">;

export function Search({ placeholder = "Search fonts…", ...rest }: SearchProps): JSX.Element {
  const { store, state, ids, inputRef } = useFontInputContext("Search");
  const activeId = state.highlightedIndex >= 0 ? ids.option(state.highlightedIndex) : undefined;
  return (
    <input
      ref={inputRef}
      id={ids.input}
      type="text"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      aria-expanded={state.open}
      aria-controls={ids.listbox}
      aria-activedescendant={activeId}
      placeholder={placeholder}
      value={state.search}
      onInput={(e: JSX.TargetedEvent<HTMLInputElement>) => store.setSearch(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (handleComboboxKey(comboboxTarget(store), e)) e.preventDefault();
      }}
      {...rest}
    />
  );
}

export interface ListProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> {
  children: (font: { family: string }, index: number) => ComponentChildren;
  estimateSize?: number;
  overscan?: number;
}

export function List({
  children,
  estimateSize = 36,
  overscan = 8,
  style,
  ...rest
}: ListProps): JSX.Element {
  const { state, ids } = useFontInputContext("List");
  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: state.filtered.length,
    scrollRef,
    estimateSize,
    overscan,
  });

  useEffect(() => {
    if (state.highlightedIndex >= 0) virtualizer.scrollToIndex(state.highlightedIndex);
  }, [state.highlightedIndex, virtualizer]);

  return (
    <div
      ref={scrollRef}
      id={ids.listbox}
      role="listbox"
      style={{ overflow: "auto", ...(style as object) }}
      {...rest}
    >
      <div style={{ height: virtualizer.getTotalSize(), position: "relative", width: "100%" }}>
        {virtualizer.getVirtualItems().map((row) => {
          const font = state.filtered[row.index];
          if (!font) return null;
          return (
            <div
              key={String(row.key)}
              data-index={row.index}
              ref={(n) => {
                if (n) virtualizer.measureElement(n);
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${row.start}px)`,
              }}
            >
              <ItemProvider value={{ font, index: row.index }}>
                {children(font, row.index)}
              </ItemProvider>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface ItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  previewFont?: boolean;
}

export function Item({ previewFont = true, children, style, ...rest }: ItemProps): JSX.Element {
  const { store, state, ids } = useFontInputContext("Item");
  const { font, index } = useItemContext("Item");
  const selected = state.value === font.family;
  const highlighted = state.highlightedIndex === index;
  return (
    <div
      id={ids.option(index)}
      role="option"
      aria-selected={selected}
      data-selected={selected ? "" : undefined}
      data-highlighted={highlighted ? "" : undefined}
      style={previewFont ? { fontFamily: font.family, ...(style as object) } : style}
      onClick={() => store.select(font.family)}
      onMouseEnter={() => store.highlight(index)}
      {...rest}
    >
      {children ?? font.family}
    </div>
  );
}

export type EmptyProps = JSX.HTMLAttributes<HTMLDivElement>;

export function Empty({ children, ...rest }: EmptyProps): JSX.Element | null {
  const { state } = useFontInputContext("Empty");
  if (state.loading || state.filtered.length > 0) return null;
  return <div {...rest}>{children}</div>;
}
