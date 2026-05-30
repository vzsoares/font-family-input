# @font-family-input/svelte

> Composable, unstyled Svelte 5 primitives for `font-family-input`.

Built with Svelte 5 runes. Uses fixed-height list windowing (no extra virtual dependency).

## Install

```bash
bun add @font-family-input/svelte
```

## Usage

```svelte
<script lang="ts">
  import { Root, Trigger, Content, Search, List, Item, Empty }
    from "@font-family-input/svelte";

  let font = $state("Inter");
</script>

<Root bind:value={font}>
  <Trigger class="trigger" />
  <Content class="content">
    <Search class="search" />
    <List style="max-height: 320px">
      {#snippet children(item, index)}
        <Item font={item} {index} class="option" />
      {/snippet}
    </List>
    <Empty>No fonts found</Empty>
  </Content>
</Root>
```

## Docs

https://vzsoares.github.io/font-family-input/guide/svelte

## License

MIT
