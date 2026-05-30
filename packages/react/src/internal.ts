import type { FontInputStore, KeyboardTarget } from "@font-family-input/core";
import type { Ref } from "react";

/** Compose multiple refs into one callback ref. */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): (node: T | null) => void {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as { current: T | null }).current = node;
    }
  };
}

/** Adapt the core store to the {@link KeyboardTarget} contract (arrow-bound). */
export function comboboxTarget(store: FontInputStore): KeyboardTarget {
  return {
    isOpen: () => store.getState().open,
    open: () => store.open(),
    close: () => store.close(),
    highlightBy: (delta) => store.highlightBy(delta),
    highlightFirst: () => store.highlightFirst(),
    highlightLast: () => store.highlightLast(),
    selectHighlighted: () => store.selectHighlighted(),
  };
}
