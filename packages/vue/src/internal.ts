import type { FontInputStore, KeyboardTarget } from "@font-family-input/core";

/** Adapt the core store to the {@link KeyboardTarget} contract. */
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
