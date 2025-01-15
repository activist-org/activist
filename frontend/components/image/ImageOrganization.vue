<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="flex h-full w-full justify-center rounded-md border border-section-div bg-layer-0"
  >
    <img v-if="imgUrl" :src="imgUrl" :alt="alt" />
    <!-- Note: Placeholder image for if no image is provided. -->
    <div
      v-else
      class="flex h-full w-full items-center justify-center rounded-r-md border bg-distinct-text text-layer-1"
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
