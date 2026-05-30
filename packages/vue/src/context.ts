import type { FontInputState, FontInputStore } from "@font-family-input/core";
import { type InjectionKey, type Ref, inject } from "vue";

export interface FontInputIds {
  trigger: string;
  listbox: string;
  input: string;
  option: (index: number) => string;
}

export interface FontInputContext {
  store: FontInputStore;
  /** Reactive snapshot of the store state. */
  state: Ref<FontInputState>;
  ids: FontInputIds;
  triggerRef: Ref<HTMLButtonElement | null>;
  contentRef: Ref<HTMLDivElement | null>;
  inputRef: Ref<HTMLInputElement | null>;
}

export const FontInputKey: InjectionKey<FontInputContext> = Symbol("font-input");

export function useFontInputContext(component: string): FontInputContext {
  const ctx = inject(FontInputKey, null);
  if (!ctx) {
    throw new Error(`<FontInput${component}> must be used within <FontInputRoot>`);
  }
  return ctx;
}
