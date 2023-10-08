<template>
  <div class="flex items-center justify-start w-full mt-3 space-x-3">
    <div v-for="url in feedItemURLs">
      <feeditem :url="url" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  feedItemURLs?: string[];
}>();
</script>
