<template>
  <NuxtLink
    :to="localePath(`${btnURL}`)"
    class="flex items-center w-full px-3 py-2 space-x-2 text-sm text-left transition duration-200 rounded-md font-md group text-light-text dark:text-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight"
    :class="{
      'bg-light-menu-selection dark:bg-dark-menu-selection text-light-distinct dark:text-dark-distinct':
        selected == true,
      'text-light-text dark:text-dark-text': selected == false,
    }"
  >
    <Icon :name="iconURL" size="1.25em" />
    <p
      v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
      class="px-1"
    >
      {{ $t(btnText) }}
    </p>
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
const sidebar = useSidebar();
</script>
