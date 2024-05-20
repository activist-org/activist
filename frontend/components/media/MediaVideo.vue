<template>
  <div
    class="card-style flex h-full w-full items-center justify-center bg-light-layer-2 dark:bg-dark-layer-2"
  >
    <div
      class="rounded-full bg-light-distinct-text p-6 dark:bg-dark-menu-selection md:p-8"
    >
      <Icon
        :name="IconMap.VIDEO"
        :color="$colorMode.value === 'dark' ? 'white' : 'black'"
        size="75px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

defineProps<{ link: string }>();
</script>
