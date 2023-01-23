<!--
v-if:width>0 "py-2 border rounded-md" and set the width
v-else:class="px-4 py-2 border rounded-md"
-->
<template>
  <NuxtLink :to="localePath(`${linkTo}`)">
    <button
      class="px-4 py-2 font-medium border rounded-md select-none text-light-distinct-bg bg-light-cta-orange hover:bg-light-cta-orange-hover active:bg-light-cta-orange border-light-distinct-bg dark:text-dark-distinct-bg dark:bg-dark-cta-orange dark:hover:bg-dark-cta-orange-hover dark:active:bg-dark-cta-orange dark:border-dark-distinct-bg"
      :class="{
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
  label: string;
  fontSize: string;
  linkTo: string;
}>();
const localePath = useLocalePath()
</script>
