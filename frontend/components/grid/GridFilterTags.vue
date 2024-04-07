<template>
  <div v-if="tags && tags.length > 0" class="h-fit w-full">
    <div class="flex space-x-3">
      <button
        v-for="t in tags"
        class="bg-light-layer-2 dark:bg-dark-layer-2 border-light-text dark:border-dark-text text-light-text dark:text-dark-text elem-shadow-sm focus-brand flex rounded-md border-[1.25px] px-3 py-1 hover:bg-black/10 dark:hover:bg-white/20"
      >
        {{ t }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tags?: string[];
}>();
</script>
