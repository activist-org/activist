<template>
  <div
    class="flex h-full w-full justify-center rounded-md border border-light-section-div bg-light-layer-0 dark:border-dark-section-div"
  >
    <img v-if="imgUrl" :src="imgUrl" :alt="alt" />
    <!-- Note: Placeholder image for if no image is provided. -->
    <div
      v-else
      class="flex h-full w-full items-center justify-center rounded-r-md border bg-light-distinct-text text-light-layer-1 dark:bg-dark-distinct-text dark:text-dark-layer-1"
    >
      <Icon class="mb-1" :name="IconMap.PEOPLE" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

defineProps<{
  imgUrl?: string;
  alt?: string;
}>();
</script>
