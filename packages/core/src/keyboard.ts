/**
 * Framework-agnostic WAI-ARIA combobox keyboard handling.
 *
 * Operates on a minimal {@link KeyboardTarget} (satisfied by the core store) so
 * it can be unit-tested without a DOM and reused by every framework adapter.
 */

export interface KeyboardTarget {
  isOpen(): boolean;
  open(): void;
  close(): void;
  highlightBy(delta: number): void;
  highlightFirst(): void;
  highlightLast(): void;
  selectHighlighted(): void;
}

/** Minimal subset of a keyboard event this module reads. */
export interface KeyLike {
  key: string;
  altKey?: boolean;
}

/**
 * Apply combobox key semantics to `target`. Returns `true` when the key was
 * handled, so callers can `preventDefault()`.
 */
export function handleComboboxKey(target: KeyboardTarget, event: KeyLike): boolean {
  const open = target.isOpen();

  switch (event.key) {
    case "ArrowDown":
      if (!open) target.open();
      else target.highlightBy(1);
      return true;
    case "ArrowUp":
      if (!open) target.open();
      else target.highlightBy(-1);
      return true;
    case "Home":
      if (open) {
        target.highlightFirst();
        return true;
      }
      return false;
    case "End":
      if (open) {
        target.highlightLast();
        return true;
      }
      return false;
    case "Enter":
      if (open) {
        target.selectHighlighted();
        return true;
      }
      return false;
    case "Escape":
      if (open) {
        target.close();
        return true;
      }
      return false;
    case "Tab":
      if (open) target.close();
      return false;
    default:
      return false;
  }
}
