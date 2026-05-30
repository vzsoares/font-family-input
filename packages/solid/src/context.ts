import type { FontInputState, FontInputStore, FontItem } from "@font-family-input/core";
import { type Accessor, createContext, useContext } from "solid-js";

export interface FontInputIds {
  trigger: string;
  listbox: string;
  input: string;
  option: (index: number) => string;
}

export interface RefHolder {
  trigger: HTMLButtonElement | undefined;
  content: HTMLDivElement | undefined;
  input: HTMLInputElement | undefined;
}

export interface FontInputContextValue {
  store: FontInputStore;
  state: Accessor<FontInputState>;
  ids: FontInputIds;
  refs: RefHolder;
}

export const FontInputContext = createContext<FontInputContextValue>();

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

export const ItemContext = createContext<ItemContextValue>();

export function useItemContext(component: string): ItemContextValue {
  const ctx = useContext(ItemContext);
  if (!ctx) {
    throw new Error(`<FontInput.${component}> must be rendered inside <FontInput.List>`);
  }
  return ctx;
}
