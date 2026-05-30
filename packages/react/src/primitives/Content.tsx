import { type HTMLAttributes, forwardRef, useEffect } from "react";
import { useFontInputContext } from "../context";
import { mergeRefs } from "../internal";

export interface FontInputContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Keep mounted while closed (for animations). Default false. */
  forceMount?: boolean;
}

/**
 * Popover surface holding the search box and listbox. Only mounts while open
 * (unless `forceMount`). Handles outside-click dismissal and focus return.
 * Positioning is left to the consumer (it ships unstyled).
 */
export const Content = forwardRef<HTMLDivElement, FontInputContentProps>(function Content(
  { forceMount = false, children, ...rest },
  ref,
) {
  const { store, state, contentRef, triggerRef, inputRef } = useFontInputContext("Content");

  // Focus the search input when opening.
  useEffect(() => {
    if (state.open) inputRef.current?.focus();
  }, [state.open, inputRef]);

  // Dismiss on outside pointer down.
  useEffect(() => {
    if (!state.open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (
        target &&
        !contentRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        store.close();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [state.open, store, contentRef, triggerRef]);

  if (!state.open && !forceMount) return null;
  const hiddenWhenClosed = forceMount && !state.open ? { hidden: true } : {};

  return (
    <div
      ref={mergeRefs(ref, contentRef)}
      data-state={state.open ? "open" : "closed"}
      {...hiddenWhenClosed}
      {...rest}
    >
      {children}
    </div>
  );
});
