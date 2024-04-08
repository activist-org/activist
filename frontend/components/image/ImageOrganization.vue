<template>
  <div
    class="flex h-full w-full justify-center rounded-md border border-light-section-div bg-light-layer-0 dark:border-dark-section-div"
  >
    <img v-if="imgURL" :src="imgURL" :alt="alt" />
    <!-- Note: Placeholder image for if no image is provided. -->
    <div
      v-else
      class="flex h-full w-full items-center justify-center rounded-r-md border bg-light-placeholder text-light-layer-1 dark:bg-dark-placeholder dark:text-dark-layer-1"
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
