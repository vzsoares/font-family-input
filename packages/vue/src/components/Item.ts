import type { FontItem } from "@font-family-input/core";
import { type PropType, defineComponent, h } from "vue";
import { useFontInputContext } from "../context";

/**
 * A single selectable option (`role="option"`). Pass the `font` and `index`
 * from the `<FontInputList>` scoped slot. Selects on click, highlights on hover.
 */
export const FontInputItem = defineComponent({
  name: "FontInputItem",
  props: {
    font: { type: Object as PropType<FontItem>, required: true },
    index: { type: Number, required: true },
    previewFont: { type: Boolean, default: true },
  },
  setup(props, { slots }) {
    const { store, state, ids } = useFontInputContext("Item");

    return () => {
      const selected = state.value.value === props.font.family;
      const highlighted = state.value.highlightedIndex === props.index;
      return h(
        "div",
        {
          id: ids.option(props.index),
          role: "option",
          "aria-selected": selected,
          "data-selected": selected ? "" : undefined,
          "data-highlighted": highlighted ? "" : undefined,
          style: props.previewFont ? { fontFamily: props.font.family } : undefined,
          onClick: () => store.select(props.font.family),
          onMouseenter: () => store.highlight(props.index),
        },
        slots.default ? slots.default() : props.font.family,
      );
    };
  },
});
