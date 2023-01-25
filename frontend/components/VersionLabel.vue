<template>
  <NuxtLink
    :to="localePath(`${linkTo}`)"
    class="px-3 py-[0.35rem] items-center text-base font-medium rounded-md select-none text-light-text bg-light-content hover:bg-light-highlight active:bg-light-content dark:text-dark-text dark:bg-dark-content dark:hover:bg-dark-highlight dark:active:bg-dark-content"
    >{{ label }}</NuxtLink
  >
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  linkTo: string;
}>();
const localePath = useLocalePath();
</script>
