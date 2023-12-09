<template>
  <div v-if="tags && tags.length > 0" class="w-full h-fit">
    <div class="flex space-x-3">
      <button
        v-for="t in tags"
        class="bg-light-header dark:bg-dark-header flex px-3 py-1 border-[1.25px] border-light-text dark:border-dark-text rounded-md text-light-text dark:text-dark-text hover:bg-black/10 dark:hover:bg-white/20 elem-shadow-sm focus-brand"
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
