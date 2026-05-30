# @font-family-input/vue

> Composable, unstyled, virtualized Vue 3 primitives for `font-family-input`.

## Install

```bash
bun add @font-family-input/vue @tanstack/vue-virtual
```

## Usage

```vue
<script setup lang="ts">
import {
  FontInputRoot, FontInputTrigger, FontInputContent,
  FontInputSearch, FontInputList, FontInputItem, FontInputEmpty,
} from "@font-family-input/vue";
import { ref } from "vue";

const font = ref("");
</script>

<template>
  <FontInputRoot v-model="font">
    <FontInputTrigger class="trigger" />
    <FontInputContent class="content">
      <FontInputSearch class="search" />
      <FontInputList style="max-height: 320px">
        <template #default="{ font: item, index }">
          <FontInputItem :font="item" :index="index" />
        </template>
      </FontInputList>
      <FontInputEmpty>No fonts found</FontInputEmpty>
    </FontInputContent>
  </FontInputRoot>
</template>
```

## Docs

https://vzsoares.github.io/font-family-input/guide/vue

## License

MIT
