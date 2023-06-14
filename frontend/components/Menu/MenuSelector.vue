<template>
  <NuxtLink
    :to="localePath(`${btnURL}`)"
    class="relative flex items-center justify-center w-full p-2 text-sm text-left transition duration-200 rounded-md basis-full font-md group focus-brand"
    :class="{
      'bg-light-menu-selection dark:bg-dark-menu-selection text-light-distinct dark:text-dark-distinct fill-light-distinct dark:fill-dark-distinct hover:bg-light-highlight dark:hover:bg-dark-highlight':
        selected == true,
      'text-light-text dark:text-dark-text fill-light-text dark:fill-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight':
        selected == false && active == true,
      'text-black/20 dark:text-white/40 fill-black/20 dark:fill-white/40 ':
        selected == false && active == false,
    }"
    :event="active ? '' : 'click'"
  >
    <div
      class="relative z-0 flex items-center w-full text-sm font-medium text-left space-x-2"
    >
      <span class="width-1/6"
        ><Icon v-if="iconURL" :name="iconURL" class="flex-shrink-0 w-5 h-5"
      /></span>
      <Transition>
        <p
          v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
          class="select-none width-5/6 whitespace-nowrap hover:light-menu-selection"
        >
          {{ $t(btnText) }}
        </p>
      </Transition>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  iconURL: string;
  btnText: string;
  btnURL: string;
  selected: boolean;
  active: boolean;
}>();
const localePath = useLocalePath();
const sidebar = useSidebar();
</script>

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
