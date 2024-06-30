<template>
  <a
    class="style-btn flex items-center space-x-2 rounded-md px-3 py-1 sm:rounded-lg"
    :href="href"
    target="_blank"
  >
    <slot />
    <div v-if="text" class="text-lg font-semibold md:text-xl">
      {{ text }}
    </div>
    <div
      v-if="isLoading"
      class="animate-pulse rounded-full bg-light-highlight p-4 text-xl font-semibold dark:bg-dark-highlight md:text-2xl"
    ></div>
    <div
      v-if="count"
      class="text-md flex h-9 w-9 items-center justify-center rounded-full bg-light-highlight p-1 font-semibold dark:bg-dark-highlight md:h-10 md:w-10"
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
