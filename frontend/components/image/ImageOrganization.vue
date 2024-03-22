<template>
  <div
    class="bg-light-layer-0 border-light-section-div dark:border-dark-section-div flex h-full w-full justify-center rounded-md border"
  >
    <img v-if="imgURL" :src="imgURL" :alt="alt" />
    <!-- Note: Placeholder image for if no image is provided. -->
    <div
      v-else
      class="bg-light-placeholder dark:bg-dark-placeholder text-light-layer-1 dark:text-dark-layer-1 flex h-full w-full items-center justify-center rounded-r-md border"
    >
      <Icon class="mb-1" name="bi:people" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  imgURL?: string;
  alt?: string;
}>();
</script>
