<template>
  <NuxtLink
    :to="localePath(`${btnURL}`)"
    class="flex items-center w-full px-3 py-2 text-sm text-left space-x-2 rounded-md font-md group text-light-text dark:text-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight"
    :class="{
      'bg-light-menu-selection dark:bg-dark-menu-selection text-light-distinct dark:text-dark-distinct':
        selected == true,
      'text-light-text dark:text-dark-text': selected == false,
    }"
  >
    <Icon :name="iconURL" size="1.25em" />
    <p class="px-1">{{ $t(btnText) }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  selected?: boolean;
  iconURL?: string;
  btnText: string;
  btnURL: string;
}>();
const localePath = useLocalePath();
</script>
