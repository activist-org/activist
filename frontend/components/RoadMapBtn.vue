<template>
  <NuxtLink
    :to="localePath('/docs/roadmap')"
    class="px-3 py-[0.35rem] items-center text-base font-medium rounded-md select-none text-light-text bg-light-content hover:bg-light-highlight active:bg-light-content dark:text-dark-text dark:bg-dark-content dark:hover:bg-dark-highlight dark:active:bg-dark-content focus:outline-none focus-visible:ring-2 focus-visible:ring-light-cta-orange dark:focus-visible:ring-dark-cta-orange focus-visible:ring-opacity-75"
    >Roadmap</NuxtLink
  >
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
