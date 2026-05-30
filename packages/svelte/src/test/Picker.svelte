<script lang="ts">
import type { FontProvider } from "@font-family-input/core";
import { Content, Empty, Item, List, Root, Search, Trigger } from "../lib/index";

interface Props {
  provider: FontProvider;
  value?: string;
  onValueChange?: (family: string) => void;
}

let { provider, value, onValueChange }: Props = $props();
</script>

<Root {provider} {value} {onValueChange}>
  <Trigger data-testid="trigger" />
  <Content data-testid="content">
    <Search data-testid="search" />
    <List>
      {#snippet children(font, index)}
        <Item {font} {index} />
      {/snippet}
    </List>
    <Empty data-testid="empty">No fonts found</Empty>
  </Content>
</Root>
