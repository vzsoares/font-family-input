<script lang="ts">
  import { onDestroy, setContext, type Snippet } from "svelte";
  import type { FontFilter, FontProvider } from "@font-family-input/core";
  import { createFontContext, FONT_INPUT_KEY } from "./context";

  interface Props {
    value?: string;
    defaultValue?: string;
    provider?: FontProvider;
    filter?: FontFilter;
    loadOnHighlight?: boolean;
    onValueChange?: (family: string) => void;
    onOpenChange?: (open: boolean) => void;
    children?: Snippet;
  }

  let {
    value = $bindable(undefined),
    defaultValue,
    provider,
    filter,
    loadOnHighlight = true,
    onValueChange,
    onOpenChange,
    children,
  }: Props = $props();

  const ctx = createFontContext({
    initialValue: value ?? defaultValue,
    provider,
    filter,
    loadOnHighlight,
    onChange: (family) => {
      value = family;
      onValueChange?.(family);
    },
    onOpenChange,
  });

  setContext(FONT_INPUT_KEY, ctx);

  // Reconcile controlled value.
  $effect(() => {
    if (value !== undefined && value !== ctx.store.getState().value) {
      ctx.store.setValue(value);
    }
  });

  onDestroy(() => ctx.store.destroy());
</script>

{@render children?.()}
