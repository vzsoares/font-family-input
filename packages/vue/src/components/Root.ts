import type { FontFilter, FontProvider } from "@font-family-input/core";
import { type PropType, defineComponent, provide } from "vue";
import { FontInputKey } from "../context";
import { useFontInput } from "../useFontInput";

/**
 * Provider + state owner for the font picker. Renders its default slot only.
 * Supports `v-model` (modelValue / update:modelValue) and `defaultValue`.
 */
export const FontInputRoot = defineComponent({
  name: "FontInputRoot",
  props: {
    modelValue: { type: String as PropType<string | undefined>, default: undefined },
    defaultValue: { type: String, default: undefined },
    provider: { type: Object as PropType<FontProvider>, default: undefined },
    filter: { type: Function as PropType<FontFilter>, default: undefined },
    loadOnHighlight: { type: Boolean, default: true },
  },
  emits: {
    "update:modelValue": (_family: string) => true,
    openChange: (_open: boolean) => true,
  },
  setup(props, { slots, emit }) {
    const ctx = useFontInput({
      value: props.modelValue !== undefined ? () => props.modelValue : undefined,
      defaultValue: props.defaultValue,
      provider: props.provider,
      filter: props.filter,
      loadOnHighlight: props.loadOnHighlight,
      onChange: (family) => emit("update:modelValue", family),
      onOpenChange: (open) => emit("openChange", open),
    });
    provide(FontInputKey, ctx);
    return () => slots.default?.();
  },
});
