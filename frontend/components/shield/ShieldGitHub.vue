<template>
  <a
    class="flex items-center px-3 py-1 rounded-md sm:rounded-lg space-x-2 style-btn"
    :href="href"
    target="_blank"
  >
    <slot></slot>
    <div v-if="text" class="text-lg font-semibold md:text-xl">
      {{ text }}
    </div>
    <div
      v-if="isLoading"
      class="p-4 text-xl font-semibold rounded-full md:text-2xl animate-pulse bg-light-highlight dark:bg-dark-highlight"
    ></div>
    <div
      v-if="count"
      class="flex items-center justify-center p-1 font-semibold rounded-full text-md w-9 h-9 md:h-10 md:w-10 bg-light-highlight dark:bg-dark-highlight"
    >
      {{ count }}
    </div>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  text?: string;
  count?: number;
  isLoading: boolean;
  href: string;
}>();
</script>
