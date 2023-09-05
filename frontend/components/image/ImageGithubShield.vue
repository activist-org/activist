<template>
  <a
    class="flex items-center px-3 py-1 border space-x-2 card-style focus-brand text-light-text dark:text-dark-text border-light-text dark:border-dark-text bg-light-content dark:bg-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight"
    :href="href"
    target="_blank"
  >
    <slot></slot>
    <div
      v-if="text"
      class="text-lg font-semibold md:text-xl"
    >
      {{ text }}
    </div>
    <div
      v-if="isLoading"
      class="p-4 text-xl font-semibold rounded-full md:text-2xl animate-pulse bg-light-highlight dark:bg-dark-highlight"
    ></div>
    <div
      v-if="count"
      class="flex items-center justify-center p-1 text-lg font-semibold rounded-full w-9 h-9 md:text-xl md:h-10 md:w-10 bg-light-highlight dark:bg-dark-highlight"
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
