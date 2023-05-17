<template>
  <NuxtLink
    :to="localePath(`${btnURL}`)"
    class="relative flex items-center justify-center w-full p-2 text-sm text-left transition duration-200 rounded-md basis-full font-md group text-light-text dark:text-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight focus-brand"
    :class="{
      'bg-light-menu-selection dark:bg-dark-menu-selection text-light-distinct dark:text-dark-distinct':
        selected == true,
      'text-light-text dark:text-dark-text': selected == false,
    }"
  >
    <div
      class="relative z-0 flex items-center w-full pl-[2.25px] space-x-2 text-sm font-medium text-left"
    >
      <span class="width-1/6"
        ><Icon :name="iconURL" class="flex-shrink-0 w-5 h-5"
      /></span>
      <Transition>
        <p
          v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
          class="width-5/6 whitespace-nowrap"
        >
          {{ $t(btnText) }}
        </p>
      </Transition>
    </div>
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
