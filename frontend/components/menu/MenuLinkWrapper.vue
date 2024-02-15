<template>
  <NuxtLink
    class="relative flex items-center justify-center w-full text-sm text-left transition duration-200 rounded-md basis-full font-md group focus-brand"
    :class="{
      'style-menu-option-cta': selected,
      'style-menu-option': !selected,
      'p-2': isPaddings,
    }"
    :to="localePath(`${to}`)"
    event="click"
  >
    <slot></slot>
  </NuxtLink>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

export interface Props {
  to: string;
  selected: boolean;
  linkClasses?: string | undefined;
  isPaddings: boolean;
};

withDefaults(defineProps<Props>(), {
  isPaddings: true,
});

</script>
