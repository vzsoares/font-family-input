import {
  type FontFilter,
  type FontInputState,
  type FontInputStore,
  type FontProvider,
  createFontInput,
} from "@font-family-input/core";
import { onScopeDispose, ref, shallowRef, watch } from "vue";
import type { FontInputContext, FontInputIds } from "./context";

let idCounter = 0;

export interface UseFontInputOptions {
  /** Controlled value getter (v-model). Reactive — read inside to track. */
  value?: () => string | undefined;
  /** Initial value (uncontrolled). */
  defaultValue?: string;
  /** Called when the user selects a family. */
  onChange?: (family: string) => void;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  provider?: FontProvider;
  filter?: FontFilter;
  loadOnHighlight?: boolean;
}

/**
 * Creates a core {@link FontInputStore} and exposes it as a reactive Vue
 * context. Bridges the store's `subscribe` into a `shallowRef` so templates
 * re-render on state changes.
 */
export function useFontInput(options: UseFontInputOptions): FontInputContext {
  const store: FontInputStore = createFontInput({
    provider: options.provider,
    filter: options.filter,
    loadOnHighlight: options.loadOnHighlight,
    defaultValue: options.value?.() ?? options.defaultValue,
    onChange: (family) => options.onChange?.(family),
    onOpenChange: (open) => options.onOpenChange?.(open),
  });

  const state = shallowRef<FontInputState>(store.getState());
  const unsubscribe = store.subscribe(() => {
    state.value = store.getState();
  });

  // Keep the store synced when used as a controlled component (v-model).
  if (options.value) {
    const source = options.value;
    watch(source, () => {
      const next = source() ?? "";
      if (next !== store.getState().value) store.setValue(next);
    });
  }

  onScopeDispose(() => {
    unsubscribe();
    store.destroy();
  });

  const base = `ffi-${++idCounter}`;
  const ids: FontInputIds = {
    trigger: `${base}-trigger`,
    listbox: `${base}-listbox`,
    input: `${base}-input`,
    option: (index: number) => `${base}-option-${index}`,
  };

  return {
    store,
    state,
    ids,
    triggerRef: ref<HTMLButtonElement | null>(null),
    contentRef: ref<HTMLDivElement | null>(null),
    inputRef: ref<HTMLInputElement | null>(null),
  };
}
