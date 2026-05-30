// @font-family-input/solid — composable, unstyled, virtualized Solid primitives.

import {
  createFontInput,
  type FontFilter,
  type FontInputState,
  type FontProvider,
  handleComboboxKey,
} from "@font-family-input/core";
import { createVirtualizer } from "@tanstack/solid-virtual";
import {
  type Accessor,
  type Component,
  createEffect,
  createSignal,
  type JSX,
  onCleanup,
  Show,
} from "solid-js";
import { Portal as SolidPortal } from "solid-js/web";
import {
  FontInputContext,
  type FontInputContextValue,
  ItemContext,
  type RefHolder,
  useFontInputContext,
  useItemContext,
} from "./context";
import { comboboxTarget, nextId } from "./internal";

export interface RootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (family: string) => void;
  onOpenChange?: (open: boolean) => void;
  provider?: FontProvider;
  filter?: FontFilter;
  loadOnHighlight?: boolean;
  children: JSX.Element;
}

export const Root: Component<RootProps> = (props) => {
  const store = createFontInput({
    provider: props.provider,
    filter: props.filter,
    loadOnHighlight: props.loadOnHighlight,
    defaultValue: props.value ?? props.defaultValue,
    onChange: (family) => props.onValueChange?.(family),
    onOpenChange: (open) => props.onOpenChange?.(open),
  });

  const [state, setState] = createSignal<FontInputState>(store.getState());
  const unsub = store.subscribe(() => setState(store.getState()));
  onCleanup(() => {
    unsub();
    store.destroy();
  });

  // Reconcile controlled value.
  createEffect(() => {
    if (props.value !== undefined && props.value !== store.getState().value) {
      store.setValue(props.value);
    }
  });

  const base = nextId();
  const refs: RefHolder = { trigger: undefined, content: undefined, input: undefined };

  const ctx: FontInputContextValue = {
    store,
    state,
    ids: {
      trigger: `${base}-trigger`,
      listbox: `${base}-listbox`,
      input: `${base}-input`,
      option: (index: number) => `${base}-option-${index}`,
    },
    refs,
  };

  return <FontInputContext.Provider value={ctx}>{props.children}</FontInputContext.Provider>;
};

export interface TriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  placeholder?: string;
  previewFont?: boolean;
}

export const Trigger: Component<TriggerProps> = (props) => {
  const { store, state, ids, refs } = useFontInputContext("Trigger");
  return (
    <button
      type="button"
      ref={(el) => {
        refs.trigger = el;
      }}
      id={ids.trigger}
      aria-haspopup="listbox"
      aria-expanded={state().open}
      aria-controls={state().open ? ids.listbox : undefined}
      data-state={state().open ? "open" : "closed"}
      data-placeholder={state().value ? undefined : ""}
      style={
        props.previewFont !== false && state().value ? { "font-family": state().value } : undefined
      }
      onClick={() => store.toggle()}
      onKeyDown={(e) => {
        if (handleComboboxKey(comboboxTarget(store), e)) e.preventDefault();
      }}
      {...props}
    >
      {props.children ?? (state().value || props.placeholder || "Select font…")}
    </button>
  );
};

export interface PortalProps {
  children: JSX.Element;
  mount?: Node;
}

export const Portal: Component<PortalProps> = (props) => {
  return <SolidPortal mount={props.mount}>{props.children}</SolidPortal>;
};

export interface ContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
}

export const Content: Component<ContentProps> = (props) => {
  const { store, state, refs } = useFontInputContext("Content");

  createEffect(() => {
    if (state().open) {
      queueMicrotask(() => refs.input?.focus());
      const onDown = (event: PointerEvent) => {
        const t = event.target as Node | null;
        if (t && !refs.content?.contains(t) && !refs.trigger?.contains(t)) store.close();
      };
      document.addEventListener("pointerdown", onDown);
      onCleanup(() => document.removeEventListener("pointerdown", onDown));
    }
  });

  return (
    <Show when={state().open || props.forceMount}>
      <div
        ref={(el) => {
          refs.content = el;
        }}
        data-state={state().open ? "open" : "closed"}
        hidden={!state().open && props.forceMount ? true : undefined}
        {...props}
      >
        {props.children}
      </div>
    </Show>
  );
};

export type SearchProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

export const Search: Component<SearchProps> = (props) => {
  const { store, state, ids, refs } = useFontInputContext("Search");
  return (
    <input
      ref={(el) => {
        refs.input = el;
      }}
      id={ids.input}
      type="text"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      aria-expanded={state().open}
      aria-controls={ids.listbox}
      aria-activedescendant={
        state().highlightedIndex >= 0 ? ids.option(state().highlightedIndex) : undefined
      }
      placeholder={(props.placeholder as string) ?? "Search fonts…"}
      value={state().search}
      onInput={(e) => store.setSearch(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (handleComboboxKey(comboboxTarget(store), e)) e.preventDefault();
      }}
      {...props}
    />
  );
};

export interface ListProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> {
  children: (font: { family: string }, index: Accessor<number>) => JSX.Element;
  estimateSize?: number;
  overscan?: number;
}

export const List: Component<ListProps> = (props) => {
  const { state, ids } = useFontInputContext("List");
  let scrollEl: HTMLDivElement | undefined;

  const virtualizer = createVirtualizer({
    get count() {
      return state().filtered.length;
    },
    getScrollElement: () => scrollEl ?? null,
    estimateSize: () => props.estimateSize ?? 36,
    overscan: props.overscan ?? 8,
  });

  createEffect(() => {
    if (state().highlightedIndex >= 0) virtualizer.scrollToIndex(state().highlightedIndex);
  });

  return (
    <div
      ref={(el) => {
        scrollEl = el;
      }}
      id={ids.listbox}
      role="listbox"
      style={{ overflow: "auto" }}
      {...props}
    >
      <div
        style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative", width: "100%" }}
      >
        {virtualizer.getVirtualItems().map((row) => {
          const font = state().filtered[row.index];
          if (!font) return null;
          return (
            <div
              data-index={row.index}
              ref={(el) => virtualizer.measureElement(el)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${row.start}px)`,
              }}
            >
              <ItemContext.Provider value={{ font, index: row.index }}>
                {props.children(font, () => row.index)}
              </ItemContext.Provider>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export interface ItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  previewFont?: boolean;
}

export const Item: Component<ItemProps> = (props) => {
  const { store, state, ids } = useFontInputContext("Item");
  const item = useItemContext("Item");
  const selected = () => state().value === item.font.family;
  const highlighted = () => state().highlightedIndex === item.index;
  return (
    <div
      id={ids.option(item.index)}
      role="option"
      aria-selected={selected()}
      data-selected={selected() ? "" : undefined}
      data-highlighted={highlighted() ? "" : undefined}
      style={props.previewFont !== false ? { "font-family": item.font.family } : undefined}
      onClick={() => store.select(item.font.family)}
      onMouseEnter={() => store.highlight(item.index)}
      {...props}
    >
      {props.children ?? item.font.family}
    </div>
  );
};

export type EmptyProps = JSX.HTMLAttributes<HTMLDivElement>;

export const Empty: Component<EmptyProps> = (props) => {
  const { state } = useFontInputContext("Empty");
  return (
    <Show when={!state().loading && state().filtered.length === 0}>
      <div {...props}>{props.children}</div>
    </Show>
  );
};

export const FontInput = { Root, Trigger, Portal, Content, Search, List, Item, Empty };

export {
  useFontInputContext,
  useItemContext,
  type FontInputContextValue,
  type FontInputIds,
  type ItemContextValue,
} from "./context";

export {
  createGoogleFontLoader,
  defaultFilter,
  GOOGLE_FONTS,
  googleFontsApiProvider,
  googleFontsProvider,
  type FontCategory,
  type FontFilter,
  type FontItem,
  type FontProvider,
} from "@font-family-input/core";
