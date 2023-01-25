<template>
  <NuxtLink
    :to="localePath(`${linkTo}`)"
    class="px-4 py-2 font-medium border rounded-md select-none text-light-distinct border-light-distinct dark:text-dark-distinct dark:border-dark-distinct"
    :class="{
      'bg-light-cta-orange dark:bg-dark-cta-orange hover:bg-light-cta-orange-light active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-light dark:active:bg-dark-cta-orange':
        cta == true,
      'bg-neutral-500 dark:bg-gray-400 hover:bg-neutral-400 active:bg-neutral-500 dark:hover:bg-gray-300 dark:active:bg-gray-400 ':
        cta == false,
      'text-sm': fontSize == 'sm',
      'text-base': fontSize == 'base',
      'text-lg': fontSize == 'lg',
      'text-xl px-6 py-3': fontSize == 'xl',
      'text-2xl px-6 py-3': fontSize == '2xl',
      'text-3xl px-6 py-3': fontSize == '3xl',
    }"
  >
    {{ $t(label) }}
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
