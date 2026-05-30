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

/** Action that moves a node to a target container (a lightweight portal). */
export function portal(node: HTMLElement, target?: Element) {
  const dest = target ?? document.body;
  dest.appendChild(node);
  return {
    update(next?: Element) {
      (next ?? document.body).appendChild(node);
    },
    destroy() {
      node.remove();
    },
  };
}
