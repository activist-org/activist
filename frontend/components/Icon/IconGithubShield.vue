<template>
  <a
    :href="href"
    class="flex items-center px-3 py-2 border space-x-2 card-style focus-brand text-light-text dark:text-dark-text border-light-text dark:border-dark-text bg-light-content dark:bg-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight"
  >
    <slot></slot>
    <div v-if="text" class="text-xl font-semibold md:text-2xl">
      {{ text }}
    </div>
    <div
      v-if="loading"
      class="p-4 text-xl font-semibold rounded-full md:text-2xl animate-pulse bg-light-highlight dark:bg-dark-highlight"
    ></div>
    <div
      v-if="count"
      class="flex items-center justify-center w-10 h-10 p-1 text-xl font-semibold rounded-full md:text-2xl md:h-11 md:w-11 bg-light-highlight dark:bg-dark-highlight"
    >
      {{ count }}
    </div>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  text: String;
  count: String;
  loading: Boolean;
  href: String;
}>();
</script>
