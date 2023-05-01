<template>
  <NuxtLink
    :to="localePath(`${btnURL}`)"
    class="flex items-center w-full px-3 text-sm text-left h-9 space-x-2 transition duration-200 rounded-md font-md group text-light-text dark:text-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight focus-brand"
    :class="{
      'bg-light-menu-selection dark:bg-dark-menu-selection text-light-distinct dark:text-dark-distinct':
        selected == true,
      'text-light-text dark:text-dark-text': selected == false,
    }"
  >
    <Icon :name="iconURL" class="flex-shrink-0 w-5 h-5" />
    <Transition>
      <p
        v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
        class="px-1"
      >
        {{ $t(btnText) }}
      </p>
    </Transition>
  </NuxtLink>
</template>

<style>
.v-enter-active {
  transition: opacity 0.25s ease;
  transition-delay: 0.125s;
}
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-from .inner {
  transition-delay: 0.25s;
}
</style>

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
