<script lang="ts">
import { handleComboboxKey } from "@font-family-input/core";
import { getContext } from "svelte";
import { FONT_INPUT_KEY, type FontInputContext } from "./context";
import { comboboxTarget } from "./internal";

interface Props {
  placeholder?: string;
  [key: string]: unknown;
}

let { placeholder = "Search fonts…", ...rest }: Props = $props();
const { store, state: fontState, ids, refs } = getContext<FontInputContext>(FONT_INPUT_KEY);
</script>

<input
  bind:this={refs.input}
  id={ids.input}
  type="text"
  role="combobox"
  autocomplete="off"
  aria-autocomplete="list"
  aria-expanded={$fontState.open}
  aria-controls={ids.listbox}
  aria-activedescendant={$fontState.highlightedIndex >= 0
    ? ids.option($fontState.highlightedIndex)
    : undefined}
  {placeholder}
  value={$fontState.search}
  oninput={(e) => store.setSearch(e.currentTarget.value)}
  onkeydown={(e) => {
    if (handleComboboxKey(comboboxTarget(store), e)) e.preventDefault();
  }}
  {...rest}
/>
