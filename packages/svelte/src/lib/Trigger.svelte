<script lang="ts">
  import { getContext, type Snippet } from "svelte";
  import { handleComboboxKey } from "@font-family-input/core";
  import { type FontInputContext, FONT_INPUT_KEY } from "./context";
  import { comboboxTarget } from "./internal";

  interface Props {
    placeholder?: string;
    previewFont?: boolean;
    children?: Snippet<[string]>;
    [key: string]: unknown;
  }

  let { placeholder = "Select font…", previewFont = true, children, ...rest }: Props = $props();
  // Aliased to avoid colliding with the `$state` rune.
  const { store, state: fontState, ids, refs } = getContext<FontInputContext>(FONT_INPUT_KEY);
</script>

<button
  bind:this={refs.trigger}
  type="button"
  id={ids.trigger}
  aria-haspopup="listbox"
  aria-expanded={$fontState.open}
  aria-controls={$fontState.open ? ids.listbox : undefined}
  data-state={$fontState.open ? "open" : "closed"}
  data-placeholder={$fontState.value ? undefined : ""}
  style={previewFont && $fontState.value ? `font-family:"${$fontState.value}"` : undefined}
  onclick={() => store.toggle()}
  onkeydown={(e) => {
    if (handleComboboxKey(comboboxTarget(store), e)) e.preventDefault();
  }}
  {...rest}
>
  {#if children}{@render children($fontState.value)}{:else}{$fontState.value || placeholder}{/if}
</button>
