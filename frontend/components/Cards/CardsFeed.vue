<template>
  <div class="flex items-center justify-start space-x-3 w-full mt-3">
    <div v-for="url in feedItemURLs">
      <CardsFeedItem :url="url"></CardsFeedItem>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  feedItemURLs?: Array<string>;
}>();
</script>
