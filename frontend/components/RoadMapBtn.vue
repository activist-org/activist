<template>
  <NuxtLink
    :to="localePath('/docs/roadmap')"
    class="px-3 py-[0.35rem] items-center text-base font-medium rounded-md select-none text-light-text bg-light-content hover:bg-light-highlight active:bg-light-content dark:text-dark-text dark:bg-dark-content dark:hover:bg-dark-highlight dark:active:bg-dark-content"
    >Roadmap</NuxtLink
  >
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
