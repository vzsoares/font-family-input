import { useVirtualizer } from "@tanstack/vue-virtual";
import { computed, defineComponent, h, ref, watch } from "vue";
import { useFontInputContext } from "../context";

/**
 * Virtualized listbox. Owns the scroll container and renders only the visible
 * options via `@tanstack/vue-virtual`. Exposes a scoped slot `{ font, index }`
 * per visible option. Set a `max-height` via CSS to bound it.
 */
export const FontInputList = defineComponent({
  name: "FontInputList",
  props: {
    estimateSize: { type: Number, default: 36 },
    overscan: { type: Number, default: 8 },
  },
  setup(props, { slots }) {
    const { state, ids } = useFontInputContext("List");
    const scrollRef = ref<HTMLDivElement | null>(null);

    const virtualizer = useVirtualizer(
      computed(() => ({
        count: state.value.filtered.length,
        getScrollElement: () => scrollRef.value,
        estimateSize: () => props.estimateSize,
        overscan: props.overscan,
      })),
    );

    // Keep the highlighted option in view during keyboard navigation.
    watch(
      () => state.value.highlightedIndex,
      (index) => {
        if (index >= 0) virtualizer.value.scrollToIndex(index);
      },
    );

    return () => {
      const rows = virtualizer.value.getVirtualItems();
      return h(
        "div",
        {
          ref: scrollRef,
          id: ids.listbox,
          role: "listbox",
          style: { overflow: "auto" },
        },
        [
          h(
            "div",
            {
              style: {
                height: `${virtualizer.value.getTotalSize()}px`,
                position: "relative",
                width: "100%",
              },
            },
            rows.map((row) => {
              const font = state.value.filtered[row.index];
              if (!font) return null;
              return h(
                "div",
                {
                  key: String(row.key),
                  "data-index": row.index,
                  ref: (el: unknown) => virtualizer.value.measureElement(el as Element | null),
                  style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${row.start}px)`,
                  },
                },
                slots.default?.({ font, index: row.index }),
              );
            }),
          ),
        ],
      );
    };
  },
});
