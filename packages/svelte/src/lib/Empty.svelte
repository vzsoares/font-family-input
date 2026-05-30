<script lang="ts">
import { type Snippet, getContext } from "svelte";
import { FONT_INPUT_KEY, type FontInputContext } from "./context";

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
