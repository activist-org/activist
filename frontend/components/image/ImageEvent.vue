<template>
  <!-- Note: We want event images to be centered within their parent div and change size based on their container. -->
  <div class="flex justify-center w-full h-full rounded-md">
    <div
      class="w-[20%] h-full rounded-l-md"
      :class="{
        'bg-light-action-red dark:bg-dark-action-red': eventType == 'action',
        'bg-light-learn-blue dark:bg-dark-learn-blue': eventType == 'learn',
      }"
    ></div>
    <img v-if="imgURL" class="object-cover" :src="imgURL" />
    <!-- Note: Placeholder image for if no image is provided. -->
    <div
      v-else
      class="flex w-[80%] h-full rounded-r-md bg-light-content dark:bg-dark-content justify-center items-center text-light-text dark:text-dark-text"
    >
      <Icon name="bi:calendar-check" class="mb-1 w-[75%] h-[75%]" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eventType: "action" | "learn";
  imgURL?: string;
}>();
</script>
