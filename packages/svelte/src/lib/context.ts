import {
  type FontFilter,
  type FontInputState,
  type FontInputStore,
  type FontProvider,
  createFontInput,
} from "@font-family-input/core";
import type { Readable } from "svelte/store";

export const FONT_INPUT_KEY = Symbol("font-input");

export interface FontInputIds {
  trigger: string;
  listbox: string;
  input: string;
  option: (index: number) => string;
}

export interface RefHolder {
  trigger?: HTMLButtonElement;
  content?: HTMLDivElement;
  input?: HTMLInputElement;
}

export interface FontInputContext {
  store: FontInputStore;
  /** Svelte-readable snapshot of the store state (use as `$state` store). */
  state: Readable<FontInputState>;
  ids: FontInputIds;
  refs: RefHolder;
}

export interface CreateFontContextOptions {
  initialValue?: string;
  provider?: FontProvider;
  filter?: FontFilter;
  loadOnHighlight?: boolean;
  onChange?: (family: string) => void;
  onOpenChange?: (open: boolean) => void;
}

let idCounter = 0;

export function createFontContext(options: CreateFontContextOptions): FontInputContext {
  const store = createFontInput({
    provider: options.provider,
    filter: options.filter,
    loadOnHighlight: options.loadOnHighlight,
    defaultValue: options.initialValue,
    onChange: options.onChange,
    onOpenChange: options.onOpenChange,
  });

  const state: Readable<FontInputState> = {
    subscribe(run) {
      run(store.getState());
      return store.subscribe(() => run(store.getState()));
    },
  };

  const base = `ffi-${++idCounter}`;
  return {
    store,
    state,
    ids: {
      trigger: `${base}-trigger`,
      listbox: `${base}-listbox`,
      input: `${base}-input`,
      option: (index: number) => `${base}-option-${index}`,
    },
    refs: {},
  };
}
