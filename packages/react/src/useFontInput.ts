import {
  type FontFilter,
  type FontInputStore,
  type FontProvider,
  createFontInput,
} from "@font-family-input/core";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { FontInputContextValue } from "./context";

export interface UseFontInputProps {
  /** Controlled selected family. */
  value?: string;
  /** Initial selected family (uncontrolled). */
  defaultValue?: string;
  /** Called when the user selects a family. */
  onValueChange?: (family: string) => void;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Font source. Defaults to the bundled Google Fonts provider. */
  provider?: FontProvider;
  /** Override the search strategy. */
  filter?: FontFilter;
  /** Load font stylesheets as options are highlighted (live preview). Default true. */
  loadOnHighlight?: boolean;
}

/**
 * Creates and binds a core {@link FontInputStore} to React. Reconciles
 * controlled (`value`) and uncontrolled (`defaultValue`) usage and returns the
 * value consumed by {@link FontInputProvider}.
 */
export function useFontInput(props: UseFontInputProps): FontInputContextValue {
  const callbacks = useRef(props);
  callbacks.current = props;

  const controlled = props.value !== undefined;

  const [store] = useState<FontInputStore>(() =>
    createFontInput({
      provider: props.provider,
      filter: props.filter,
      loadOnHighlight: props.loadOnHighlight,
      defaultValue: props.value ?? props.defaultValue,
      onChange: (family) => callbacks.current.onValueChange?.(family),
      onOpenChange: (open) => callbacks.current.onOpenChange?.(open),
    }),
  );

  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);

  // Keep the store's value in sync when used as a controlled component.
  useEffect(() => {
    if (controlled && props.value !== undefined && props.value !== store.getState().value) {
      store.setValue(props.value);
    }
  }, [controlled, props.value, store]);

  useEffect(() => () => store.destroy(), [store]);

  const baseId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return {
    store,
    state,
    ids: {
      trigger: `${baseId}-trigger`,
      listbox: `${baseId}-listbox`,
      input: `${baseId}-input`,
      option: (index: number) => `${baseId}-option-${index}`,
    },
    triggerRef,
    contentRef,
    inputRef,
  };
}
