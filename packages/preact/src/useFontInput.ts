import {
  type FontFilter,
  type FontInputStore,
  type FontProvider,
  createFontInput,
} from "@font-family-input/core";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { FontInputContextValue } from "./context";

let idCounter = 0;

export interface UseFontInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (family: string) => void;
  onOpenChange?: (open: boolean) => void;
  provider?: FontProvider;
  filter?: FontFilter;
  loadOnHighlight?: boolean;
}

/** Creates and binds a core store to Preact via a subscribe-driven rerender. */
export function useFontInput(props: UseFontInputProps): FontInputContextValue {
  const callbacks = useRef(props);
  callbacks.current = props;

  const controlled = props.value !== undefined;
  const [, setTick] = useState(0);
  const rerender = () => setTick((n) => n + 1);

  const store: FontInputStore = useMemo(
    () =>
      createFontInput({
        provider: props.provider,
        filter: props.filter,
        loadOnHighlight: props.loadOnHighlight,
        defaultValue: props.value ?? props.defaultValue,
        onChange: (family) => callbacks.current.onValueChange?.(family),
        onOpenChange: (open) => callbacks.current.onOpenChange?.(open),
      }),
    [],
  );

  useEffect(() => {
    const unsub = store.subscribe(() => rerender());
    return () => {
      unsub();
      store.destroy();
    };
  }, [store]);

  useEffect(() => {
    if (controlled && props.value !== undefined && props.value !== store.getState().value) {
      store.setValue(props.value);
    }
  }, [controlled, props.value, store]);

  const ids = useMemo(() => {
    const base = `ffi-${++idCounter}`;
    return {
      trigger: `${base}-trigger`,
      listbox: `${base}-listbox`,
      input: `${base}-input`,
      option: (index: number) => `${base}-option-${index}`,
    };
  }, []);

  return {
    store,
    state: store.getState(),
    ids,
    triggerRef: useRef<HTMLButtonElement>(null),
    contentRef: useRef<HTMLDivElement>(null),
    inputRef: useRef<HTMLInputElement>(null),
  };
}
