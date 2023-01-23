<template>
  <NuxtLink :to="localePath(`${linkTo}`)">
    <div>
      <button
        class="px-3 py-1 font-medium border rounded-md select-none text-light-text bg-light-content-bg hover:bg-light-highlight active:bg-light-content-bg border-light-text dark:text-dark-text dark:bg-dark-content-bg dark:hover:bg-dark-highlight dark:active:bg-dark-content-bg dark:border-dark-text"
      >
        {{ label }}
      </button>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  linkTo: string;
}>();
const localePath = useLocalePath()
</script>
