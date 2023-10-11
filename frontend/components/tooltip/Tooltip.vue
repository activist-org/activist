<template>
  <div
    class="flex flex-col space-y-1 px-2 py-1 rounded shadow-sm shadow-zinc-700 bg-light-distinct dark:bg-dark-distinct w-max text-light-text dark:text-dark-text tooltip"
  >
    <div class="responsive-h5" v-if="header">
      {{ header }}
    </div>
    <div v-if="text">
      {{ text }}
    </div>
    <slot name="button" class="block"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  header?: string | null;
  text?: string | null;
}>();
</script>
