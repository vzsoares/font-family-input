import { defineComponent, h, onBeforeUnmount, watch } from "vue";
import { useFontInputContext } from "../context";

/**
 * Popover surface holding the search box and listbox. Renders only while open
 * (unless `forceMount`). Handles outside-click dismissal and focuses the search
 * input on open. Unstyled and unpositioned — position it yourself.
 */
export const FontInputContent = defineComponent({
  name: "FontInputContent",
  props: {
    forceMount: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const { store, state, contentRef, triggerRef, inputRef } = useFontInputContext("Content");

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (target && !contentRef.value?.contains(target) && !triggerRef.value?.contains(target)) {
        store.close();
      }
    }

    watch(
      () => state.value.open,
      (open) => {
        if (open) {
          document.addEventListener("pointerdown", onPointerDown);
          queueMicrotask(() => inputRef.value?.focus());
        } else {
          document.removeEventListener("pointerdown", onPointerDown);
        }
      },
    );

    onBeforeUnmount(() => document.removeEventListener("pointerdown", onPointerDown));

    return () => {
      const open = state.value.open;
      if (!open && !props.forceMount) return null;
      return h(
        "div",
        {
          ref: contentRef,
          "data-state": open ? "open" : "closed",
          hidden: !open && props.forceMount ? true : undefined,
        },
        slots.default?.(),
      );
    };
  },
});
