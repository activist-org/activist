<template>
  <!-- note: we want event images to be centered within their parent div and change size based on their container. -->
  <div class="flex justify-center w-full h-full">
    <div
      class="w-[20%] h-full rounded-l-md border border-light-section-div dark:border-dark-section-div border-r-0"
      :class="{
        'bg-light-act-red dark:bg-dark-act-red': eventType == 'act',
        'bg-light-learn-blue dark:bg-dark-learn-blue': eventType == 'learn',
      }"
    ></div>
    <img
      v-if="imgURL"
      class="object-cover border-light-section-div dark:border-dark-section-div"
      :src="imgURL"
    />
    <!-- note: placeholder image for if no image is provided. -->
    <div
      v-else
      class="flex w-[85%] h-full rounded-r-md bg-light-content dark:bg-dark-content border border-light-section-div dark:border-dark-section-div justify-center items-center text-light-text dark:text-dark-text"
    >
      <icon name="bi:calendar-check" class="mb-1 w-[75%] h-[75%]" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eventType: "act" | "learn";
  imgURL?: string;
}>();
</script>
