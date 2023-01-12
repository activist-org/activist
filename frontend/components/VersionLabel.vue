<template>
  <div>
    <button
      class="px-3 py-1 border rounded-md text-light-text bg-light-content-bg hover:bg-light-highlight active:bg-light-content-bg border-light-text dark:text-dark-text dark:bg-dark-content-bg dark:hover:bg-dark-highlight dark:active:bg-dark-content-bg dark:border-dark-text select-none"
    >
      {{ label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>
