<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <a
    class="card-style focus-brand flex items-center space-x-2 border-primary-text bg-layer-0 px-3 py-2 text-primary-text hover:bg-highlight"
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
