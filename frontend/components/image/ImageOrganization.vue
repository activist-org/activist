<template>
  <div
    class="flex justify-center w-full h-full border rounded-md bg-light-layer-0 border-light-section-div dark:border-dark-section-div"
  >
    <img v-if="imgURL" :src="imgURL" />
    <!-- Note: Placeholder image for if no image is provided. -->
    <div
      v-else
      class="flex items-center justify-center w-full h-full border rounded-r-md bg-light-placeholder dark:bg-dark-placeholder text-light-distinct dark:text-dark-distinct"
    >
      <Icon class="mb-1" name="bi:people" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  imgURL?: string;
}>();
</script>
