import { handleComboboxKey } from "@font-family-input/core";
import { defineComponent, h } from "vue";
import { useFontInputContext } from "../context";
import { comboboxTarget } from "../internal";

/** The filter textbox. Drives the combobox keyboard interaction. */
export const FontInputSearch = defineComponent({
  name: "FontInputSearch",
  props: {
    placeholder: { type: String, default: "Search fonts…" },
  },
  setup(props) {
    const { store, state, ids, inputRef } = useFontInputContext("Search");

    return () => {
      const idx = state.value.highlightedIndex;
      return h("input", {
        ref: inputRef,
        id: ids.input,
        type: "text",
        role: "combobox",
        autocomplete: "off",
        "aria-autocomplete": "list",
        "aria-expanded": state.value.open,
        "aria-controls": ids.listbox,
        "aria-activedescendant": idx >= 0 ? ids.option(idx) : undefined,
        placeholder: props.placeholder,
        value: state.value.search,
        onInput: (event: Event) => store.setSearch((event.target as HTMLInputElement).value),
        onKeydown: (event: KeyboardEvent) => {
          if (handleComboboxKey(comboboxTarget(store), event)) event.preventDefault();
        },
      });
    };
  },
});
