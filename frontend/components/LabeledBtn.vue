<template>
  <a
    v-if="linkTo.includes('http')"
    :href="linkTo"
    class="px-4 py-2 font-semibold text-center border select-none rounded-md xl:rounded-lg text-light-distinct border-light-distinct dark:text-dark-distinct dark:border-dark-distinct focus-brand w-fit"
    :class="{
      'bg-light-cta-orange dark:bg-dark-cta-orange hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover dark:active:bg-dark-cta-orange':
        cta == true,
      'bg-neutral-500 dark:bg-gray-400 hover:bg-neutral-400 active:bg-neutral-500 dark:hover:bg-gray-300 dark:active:bg-gray-400 ':
        cta == false,
      'text-xs': fontSize == 'xs',
      'text-sm': fontSize == 'sm',
      'text-base': fontSize == 'base',
      'text-lg': fontSize == 'lg',
      'text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3': fontSize == 'xl',
      'text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3': fontSize == '2xl',
      'text-base sm:text-lg xl:text-3xl xl:px-6 xl:py-3': fontSize == '3xl',
    }"
  >
    {{ $t(label) }}
  </a>
  <NuxtLink
    v-else
    :to="localePath(`${linkTo}`)"
    class="px-4 py-2 font-semibold text-center border select-none rounded-md xl:rounded-lg text-light-distinct border-light-distinct dark:text-dark-distinct dark:border-dark-distinct focus-brand"
    :class="{
      'bg-light-cta-orange dark:bg-dark-cta-orange hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover dark:active:bg-dark-cta-orange':
        cta == true,
      'bg-neutral-500 dark:bg-gray-400 hover:bg-neutral-400 active:bg-neutral-500 dark:hover:bg-gray-300 dark:active:bg-gray-400 ':
        cta == false,
      'text-xs': fontSize == 'xs',
      'text-sm': fontSize == 'sm',
      'text-base': fontSize == 'base',
      'text-lg': fontSize == 'lg',
      'text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3': fontSize == 'xl',
      'text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3': fontSize == '2xl',
      'text-base sm:text-lg xl:text-3xl xl:px-6 xl:py-3': fontSize == '3xl',
    }"
  >
    {{ $t(label) }}
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  cta: boolean;
  label: string;
  fontSize: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  linkTo: string;
}>();
const localePath = useLocalePath();
</script>
