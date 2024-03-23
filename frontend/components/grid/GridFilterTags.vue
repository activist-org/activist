<template>
  <div v-if="tags && tags.length > 0" class="h-fit w-full">
    <div class="flex space-x-3">
      <button
        v-for="t in tags"
        class="elem-shadow-sm focus-brand flex rounded-md border-[1.25px] border-light-text bg-light-layer-2 px-3 py-1 text-light-text hover:bg-black/10 dark:border-dark-text dark:bg-dark-layer-2 dark:text-dark-text dark:hover:bg-white/20"
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
