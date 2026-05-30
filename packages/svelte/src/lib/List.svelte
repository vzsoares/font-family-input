<script lang="ts">
  import { getContext, type Snippet } from "svelte";
  import type { FontItem } from "@font-family-input/core";
  import { type FontInputContext, FONT_INPUT_KEY } from "./context";

  interface Props {
    estimateSize?: number;
    overscan?: number;
    children: Snippet<[FontItem, number]>;
    [key: string]: unknown;
  }

  let { estimateSize = 36, overscan = 8, children, ...rest }: Props = $props();
  const { state: fontState, ids } = getContext<FontInputContext>(FONT_INPUT_KEY);

  // Fixed-height windowing — the per-framework virtualization strategy for the
  // Svelte adapter (deterministic and dependency-free, like the Web Component).
  let scrollEl = $state<HTMLDivElement>();
  let scrollTop = $state(0);
  let viewport = $state(300);

  $effect(() => {
    if (scrollEl) viewport = scrollEl.clientHeight || 300;
  });

  const count = $derived($fontState.filtered.length);
  const start = $derived(Math.max(0, Math.floor(scrollTop / estimateSize) - overscan));
  const end = $derived(
    Math.min(count, Math.ceil((scrollTop + viewport) / estimateSize) + overscan),
  );
  const rows = $derived(
    $fontState.filtered.slice(start, end).map((font, i) => ({ font, index: start + i })),
  );

  // Keep the highlighted option in view.
  $effect(() => {
    const hi = $fontState.highlightedIndex;
    if (hi >= 0 && scrollEl) {
      const top = hi * estimateSize;
      const bottom = top + estimateSize;
      if (top < scrollEl.scrollTop) scrollEl.scrollTop = top;
      else if (bottom > scrollEl.scrollTop + scrollEl.clientHeight)
        scrollEl.scrollTop = bottom - scrollEl.clientHeight;
    }
  });
</script>

<div
  bind:this={scrollEl}
  id={ids.listbox}
  role="listbox"
  style="overflow:auto"
  onscroll={(e) => {
    scrollTop = e.currentTarget.scrollTop;
  }}
  {...rest}
>
  <div style="height:{count * estimateSize}px;position:relative;width:100%">
    {#each rows as row (row.font.family)}
      <div
        data-index={row.index}
        style="position:absolute;top:0;left:0;width:100%;height:{estimateSize}px;transform:translateY({row.index *
          estimateSize}px)"
      >
        {@render children(row.font, row.index)}
      </div>
    {/each}
  </div>
</div>
