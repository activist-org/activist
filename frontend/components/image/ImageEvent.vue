<template>
  <!-- Note: We want event images to be centered within their parent div and change size based on their container. -->
  <div class="flex h-full w-full justify-center rounded-md">
    <div
      class="h-full w-[20%] rounded-l-md"
      :class="{
        'bg-action-red': eventType == 'action',
        'bg-learn-blue': eventType == 'learn',
      }"
    ></div>
    <img
      v-if="imgUrl && imgUrl !== ''"
      class="object-cover"
      :src="imgUrl"
      :alt="alt"
    />
    <!-- Note: Placeholder image for if no image is provided. -->
    <div
      v-else
      class="flex h-full w-[80%] items-center justify-center rounded-r-md bg-layer-0 text-primary-text"
    >
      <Icon :name="IconMap.EVENT" class="mb-1 h-[75%] w-[75%]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

defineProps<{
  eventType: "action" | "learn";
  imgUrl?: string;
  alt?: string;
}>();
</script>
