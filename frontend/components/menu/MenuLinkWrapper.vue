<template>
  <NuxtLink
    class="relative flex items-center justify-center w-full p-2 text-sm text-left transition duration-200 rounded-md basis-full font-md group focus-brand"
    :class="{
      'style-menu-option-selected': selected,
      'style-menu-option': !selected,
    }"
    :to="localePath(`${to}`)"
    event="click"
  >
    <slot></slot>
  </NuxtLink>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

defineProps<{
  to: string;
  selected: boolean;
  linkClasses?: string | undefined;
}>();
</script>
