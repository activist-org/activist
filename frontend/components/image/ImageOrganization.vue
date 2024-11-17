<template>
  <div
    class="bg-layer-0 border-section-div flex h-full w-full justify-center rounded-md border"
  >
    <img v-if="imgUrl" :src="imgUrl" :alt="alt" />
    <!-- Note: Placeholder image for if no image is provided. -->
    <div
      v-else
      class="text-layer-1 bg-distinct-text flex h-full w-full items-center justify-center rounded-r-md border"
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
