import { handleComboboxKey } from "@font-family-input/core";
import { defineComponent, h } from "vue";
import { useFontInputContext } from "../context";
import { comboboxTarget } from "../internal";

/** The button that shows the current selection and toggles the list. */
export const FontInputTrigger = defineComponent({
  name: "FontInputTrigger",
  props: {
    placeholder: { type: String, default: "Select font…" },
    previewFont: { type: Boolean, default: true },
  },
  setup(props, { slots }) {
    const { store, state, ids, triggerRef } = useFontInputContext("Trigger");

    return () => {
      const value = state.value.value;
      return h(
        "button",
        {
          ref: triggerRef,
          id: ids.trigger,
          type: "button",
          "aria-haspopup": "listbox",
          "aria-expanded": state.value.open,
          "aria-controls": state.value.open ? ids.listbox : undefined,
          "data-state": state.value.open ? "open" : "closed",
          "data-placeholder": value ? undefined : "",
          style: props.previewFont && value ? { fontFamily: value } : undefined,
          onClick: () => store.toggle(),
          onKeydown: (event: KeyboardEvent) => {
            if (handleComboboxKey(comboboxTarget(store), event)) event.preventDefault();
          },
        },
        slots.default ? slots.default({ value }) : value || props.placeholder,
      );
    };
  },
});
