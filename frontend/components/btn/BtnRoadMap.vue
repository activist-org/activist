<template>
  <NuxtLink
    :to="localePath('/about/roadmap')"
    class="px-3 py-[0.35rem] items-center text-base font-semibold rounded-md select-none text-light-text bg-light-content hover:bg-light-highlight active:bg-light-content dark:text-dark-text dark:bg-dark-content dark:hover:bg-dark-highlight dark:active:bg-dark-content focus-brand"
    >{{ $t("components.btn.btn-roadmap.title") }}</NuxtLink
  >
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
