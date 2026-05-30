<script lang="ts">
  import { getContext, type Snippet } from "svelte";
  import { type FontInputContext, FONT_INPUT_KEY } from "./context";

  interface Props {
    children?: Snippet;
    [key: string]: unknown;
  }

  let { children, ...rest }: Props = $props();
  const { state: fontState } = getContext<FontInputContext>(FONT_INPUT_KEY);
</script>

{#if !$fontState.loading && $fontState.filtered.length === 0}
  <div {...rest}>{@render children?.()}</div>
{/if}
