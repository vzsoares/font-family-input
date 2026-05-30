import { handleComboboxKey } from "@font-family-input/core";
import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { useFontInputContext } from "../context";
import { comboboxTarget, mergeRefs } from "../internal";

export interface FontInputTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Text shown when no font is selected. */
  placeholder?: string;
  /** Custom content. Receives the current value; defaults to value-or-placeholder. */
  children?: ReactNode | ((value: string) => ReactNode);
  /** Apply the selected font as the button's `font-family` for preview. Default true. */
  previewFont?: boolean;
}

/** The button that opens the picker and shows the current selection. */
export const Trigger = forwardRef<HTMLButtonElement, FontInputTriggerProps>(function Trigger(
  {
    placeholder = "Select font…",
    children,
    previewFont = true,
    onClick,
    onKeyDown,
    style,
    ...rest
  },
  ref,
) {
  const { store, state, ids, triggerRef } = useFontInputContext("Trigger");

  const content =
    typeof children === "function"
      ? children(state.value)
      : (children ?? (state.value || placeholder));

  return (
    <button
      type="button"
      ref={mergeRefs(ref, triggerRef)}
      id={ids.trigger}
      aria-haspopup="listbox"
      aria-expanded={state.open}
      aria-controls={state.open ? ids.listbox : undefined}
      data-state={state.open ? "open" : "closed"}
      data-placeholder={state.value ? undefined : ""}
      style={previewFont && state.value ? { fontFamily: state.value, ...style } : style}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) store.toggle();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (handleComboboxKey(comboboxTarget(store), event)) event.preventDefault();
      }}
      {...rest}
    >
      {content}
    </button>
  );
});
