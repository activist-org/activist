<template>
  <NuxtLink :to="localePath(`${linkTo}`)">
    <button
      class="px-4 py-2 font-medium border rounded-md select-none text-light-distinct-bg border-light-distinct-bg dark:text-dark-distinct-bg dark:border-dark-distinct-bg"
      :class="{
        'bg-light-cta-orange dark:bg-dark-cta-orange hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover dark:active:bg-dark-cta-orange':
          cta == true,
        'bg-gray-500 dark:bg-gray-400 hover:bg-gray-400 active:bg-gray-500 dark:hover:bg-gray-300 dark:active:bg-gray-400 ':
          cta == false,
        'text-base': fontSize == 'base',
        'text-lg': fontSize == 'lg',
        'text-xl px-6 py-3': fontSize == 'xl',
        'text-2xl px-6 py-3': fontSize == '2xl',
        'text-3xl px-6 py-3': fontSize == '3xl',
      }"
    >
      {{ label }}
    </button>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  cta: boolean;
  label: string;
  fontSize: string;
  linkTo: string;
}>();
const localePath = useLocalePath();
</script>
