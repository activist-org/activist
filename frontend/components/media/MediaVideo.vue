<template>
  <div
    class="card-style bg-layer-2 flex h-full w-full items-center justify-center"
  >
    <div
      class="bg-distinct-text dark:bg-menu-selection rounded-full p-6 md:p-8"
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
