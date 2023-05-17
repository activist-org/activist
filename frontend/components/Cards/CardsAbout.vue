<template>
  <div
    class="flex flex-col items-center w-full h-min card-style sm:items-start"
  >
    <div class="px-1 py-1 sm:px-2 sm:py-2">
      <p>About</p>
      <p>{{ description }}</p>
      <p>This about card describes an {{ aboutType }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  description: string;
  aboutType: string; // `organization`, `event`, etc
}>();
</script>
