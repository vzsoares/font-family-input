import { defineComponent, h } from "vue";
import { useFontInputContext } from "../context";

/** Renders its default slot only when the filtered catalog is empty (and loaded). */
export const FontInputEmpty = defineComponent({
  name: "FontInputEmpty",
  setup(_props, { slots }) {
    const { state } = useFontInputContext("Empty");
    return () => {
      if (state.value.loading || state.value.filtered.length > 0) return null;
      return h("div", null, slots.default?.());
    };
  },
});
