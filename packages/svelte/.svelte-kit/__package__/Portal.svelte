<script lang="ts">
  import type { Snippet } from "svelte";
  import { portal } from "./internal";

  interface Props {
    target?: Element;
    children?: Snippet;
  }

  let { target, children }: Props = $props();
</script>

<div use:portal={target} style="display:contents">
  {@render children?.()}
</div>
