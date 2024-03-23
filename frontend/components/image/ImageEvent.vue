<template>
  <!-- Note: We want event images to be centered within their parent div and change size based on their container. -->
  <div class="flex h-full w-full justify-center rounded-md">
    <div
      class="h-full w-[20%] rounded-l-md"
      :class="{
        'bg-light-action-red dark:bg-dark-action-red': eventType == 'action',
        'bg-light-learn-blue dark:bg-dark-learn-blue': eventType == 'learn',
      }"
    ></div>
    <img v-if="imgURL" class="object-cover" :src="imgURL" :alt="alt" />
    <!-- Note: Placeholder image for if no image is provided. -->
    <div
      v-else
      class="bg-light-layer-0 dark:bg-dark-layer-0 text-light-text dark:text-dark-text flex h-full w-[80%] items-center justify-center rounded-r-md"
    >
      <Icon name="bi:calendar-check" class="mb-1 h-[75%] w-[75%]" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eventType: "action" | "learn";
  imgURL?: string;
  alt?: string;
}>();
</script>
