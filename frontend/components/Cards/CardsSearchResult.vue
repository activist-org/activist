<template>
  <div
    class="flex flex-col items-center w-full h-min card-style sm:items-start"
  >
    <div class="px-1 py-1 sm:px-2 sm:py-2">
      <p>{{ name }}</p>
      <p>{{ description }}</p>
      <p>This search result is an {{ searchResultType }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  description: string;
  searchResultType: string; // `organization`, `event`, etc
  private?: boolean;
}>();
</script>
