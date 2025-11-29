<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLink
    v-if="to"
    class="font-md group relative flex w-full basis-full items-center justify-center rounded-md text-left text-sm transition duration-200 focus-brand"
    :class="{
      'style-menu-option-cta': selected,
      'style-menu-option': !selected && isAddStyles,
      'p-2': isAddStyles,
    }"
    :to="localePath(`${to}`)"
  >
    <slot />
  </NuxtLink>
   <button
    v-else
    class="font-md group relative flex w-full basis-full items-center justify-center rounded-md text-left text-sm transition duration-200 focus-brand cursor-pointer"
    :class="{
      'style-menu-option-cta': selected,
      'style-menu-option': !selected && isAddStyles,
      'p-2': isAddStyles,
    }"
    type="button"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

export interface Props {
  to?: string;
  selected: boolean;
  isAddStyles?: boolean;
}

withDefaults(defineProps<Props>(), {
  isAddStyles: true,
});
</script>
