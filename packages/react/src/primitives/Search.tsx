import { handleComboboxKey } from "@font-family-input/core";
import { type InputHTMLAttributes, forwardRef } from "react";
import { useFontInputContext } from "../context";
import { comboboxTarget, mergeRefs } from "../internal";

export type FontInputSearchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
>;

/** The filter textbox. Drives the combobox keyboard interaction. */
export const Search = forwardRef<HTMLInputElement, FontInputSearchProps>(function Search(
  { onKeyDown, placeholder = "Search fonts…", ...rest },
  ref,
) {
  const { store, state, ids, inputRef } = useFontInputContext("Search");
  const activeId = state.highlightedIndex >= 0 ? ids.option(state.highlightedIndex) : undefined;

  return (
    <input
      ref={mergeRefs(ref, inputRef)}
      id={ids.input}
      type="text"
      role="combobox"
      autoComplete="off"
      aria-autocomplete="list"
      aria-expanded={state.open}
      aria-controls={ids.listbox}
      aria-activedescendant={activeId}
      placeholder={placeholder}
      value={state.search}
      onChange={(event) => store.setSearch(event.target.value)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (handleComboboxKey(comboboxTarget(store), event)) event.preventDefault();
      }}
      {...rest}
    />
  );
});
