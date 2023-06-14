<template>
  <div class="flex items-center justify-start w-full mt-3 space-x-3">
    <div v-for="url in feedItemURLs">
      <CardFeedItem :url="url" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  feedItemURLs?: Array<string>;
}>();
</script>
