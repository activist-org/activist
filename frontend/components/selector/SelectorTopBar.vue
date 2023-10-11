<template>
  <div v-if="selectors.length > 0" class="w-full h-fit">
    <div class="flex flex-row"> 
      <button
        v-for="t in selectors"
        class="w-full justify-center bg-light-header dark:bg-dark-header flex px-3 py-1 border-l-[1px] border-y-[1px] border-light-text dark:border-dark-text text-light-text dark:text-dark-text hover:bg-black/10 dark:hover:bg-white/30"
      >
        {{ t }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectors?: string[];
}>();
</script>