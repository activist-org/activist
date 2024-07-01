<template>
  <a
    class="card-style focus-brand flex items-center space-x-2 border-light-text bg-light-layer-0 px-3 py-2 text-light-text hover:bg-light-highlight dark:border-dark-text dark:bg-dark-layer-0 dark:text-dark-text dark:hover:bg-dark-highlight"
    :href="href"
    target="_blank"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
defineProps<{
  href: string;
}>();
</script>
