import type { FontInputState, FontInputStore, FontItem } from "@font-family-input/core";
import { type RefObject, createContext } from "preact";
import { useContext } from "preact/hooks";

export interface FontInputIds {
  trigger: string;
  listbox: string;
  input: string;
  option: (index: number) => string;
}

export interface FontInputContextValue {
  store: FontInputStore;
  state: FontInputState;
  ids: FontInputIds;
  triggerRef: RefObject<HTMLButtonElement>;
  contentRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
}

const FontInputContext = createContext<FontInputContextValue | null>(null);
export const FontInputProvider = FontInputContext.Provider;

export function useFontInputContext(component: string): FontInputContextValue {
  const ctx = useContext(FontInputContext);
  if (!ctx) {
    throw new Error(`<FontInput.${component}> must be used within <FontInput.Root>`);
  }
  return ctx;
}

export interface ItemContextValue {
  font: FontItem;
  index: number;
}

const ItemContext = createContext<ItemContextValue | null>(null);
export const ItemProvider = ItemContext.Provider;

export function useItemContext(component: string): ItemContextValue {
  const ctx = useContext(ItemContext);
  if (!ctx) {
    throw new Error(`<FontInput.${component}> must be rendered inside <FontInput.List>`);
  }
  return ctx;
}
