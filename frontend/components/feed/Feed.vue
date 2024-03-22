<template>
  <div class="mt-3 flex w-full items-center justify-start space-x-3">
    <div v-for="url in feedItemURLs">
      <FeedItem :url="url" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  feedItemURLs?: string[];
}>();
</script>
