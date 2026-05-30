<script lang="ts">
import { type Snippet, getContext } from "svelte";
import { FONT_INPUT_KEY, type FontInputContext } from "./context";

interface Props {
  forceMount?: boolean;
  children?: Snippet;
  [key: string]: unknown;
}

let { forceMount = false, children, ...rest }: Props = $props();
const { store, state: fontState, refs } = getContext<FontInputContext>(FONT_INPUT_KEY);

$effect(() => {
  if (!$fontState.open) return;
  queueMicrotask(() => refs.input?.focus());
  const onDown = (event: PointerEvent) => {
    const t = event.target as Node | null;
    if (t && !refs.content?.contains(t) && !refs.trigger?.contains(t)) store.close();
  };
  document.addEventListener("pointerdown", onDown);
  return () => document.removeEventListener("pointerdown", onDown);
});
</script>

{#if $fontState.open || forceMount}
  <div
    bind:this={refs.content}
    data-state={$fontState.open ? "open" : "closed"}
    hidden={!$fontState.open && forceMount ? true : undefined}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}
