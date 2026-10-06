<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="flex size-full justify-center rounded-md border border-section-div bg-layer-0"
  >
    <img v-if="imgUrl" :alt="alt" :src="imgUrl" />
    <!-- Note: Placeholder image for if no image is provided. -->
    <div
      v-else
      class="flex size-full items-center justify-center text-primary-text"
    >
      <Icon class="size-[75%]" :name="IconMap.ORGANIZATION" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  imgUrl?: string;
  alt?: string;
}>();
</script>
