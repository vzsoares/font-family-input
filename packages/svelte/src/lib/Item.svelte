<script lang="ts">
import type { FontItem } from "@font-family-input/core";
import { type Snippet, getContext } from "svelte";
import { FONT_INPUT_KEY, type FontInputContext } from "./context";

interface Props {
  font: FontItem;
  index: number;
  previewFont?: boolean;
  children?: Snippet;
  [key: string]: unknown;
}

let { font, index, previewFont = true, children, ...rest }: Props = $props();
const { store, state: fontState, ids } = getContext<FontInputContext>(FONT_INPUT_KEY);
</script>

<div
  id={ids.option(index)}
  role="option"
  aria-selected={$fontState.value === font.family}
  data-selected={$fontState.value === font.family ? "" : undefined}
  data-highlighted={$fontState.highlightedIndex === index ? "" : undefined}
  style={previewFont ? `font-family:"${font.family}"` : undefined}
  onclick={() => store.select(font.family)}
  onmouseenter={() => store.highlight(index)}
  {...rest}
>
  {#if children}{@render children()}{:else}{font.family}{/if}
</div>
