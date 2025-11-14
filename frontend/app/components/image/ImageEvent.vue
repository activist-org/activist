<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <!-- Note: We want event images to be centered within their parent div and change size based on their container. -->
  <div class="flex h-full w-full justify-center rounded-md">
    <div
      class="h-full w-[20%] rounded-l-md"
      :class="{
        'bg-action-red': eventType === 'action',
        'bg-learn-blue': eventType === 'learn',
      }"
    ></div>
    <img
      v-if="imgUrl && imgUrl !== ''"
      :alt="alt"
      class="w-[80%] rounded-r-md object-cover"
      :src="imgUrl"
    />
    <!-- Note: Placeholder image for if no image is provided. -->
    <div
      v-else
      class="flex h-full w-[80%] items-center justify-center rounded-r-md bg-layer-0 text-primary-text"
    >
      <Icon class="mb-1" :name="IconMap.EVENT" :size="size" />
    </div>
  </div>
</template>

<script setup lang="ts">

withDefaults(
  defineProps<{
    eventType: "action" | "learn";
    imgUrl?: string;
    alt?: string;
    size?: string;
  }>(),
  {
    size: "7em",
  }
);
</script>
