<template>
  <a
    class="card-style focus-brand text-primary-text bg-layer-0 hover:bg-highlight border-primary-text flex items-center space-x-2 px-3 py-2"
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
