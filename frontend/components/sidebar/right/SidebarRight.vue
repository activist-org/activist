<template>
  <SidebarRightToggle
    @toggle="toggleMenuState"
    ref="ignoreElRef"
    class="flex items-center h-full"
    :menuOpen="menuOpen"
  />
  <div
    ref="target"
    id="drawer-navigation"
    class="fixed top-0 right-0 z-30 h-screen pt-12 overflow-y-auto border-l bg-light-distinct transition-[max-width] motion-reduce:transition-none overflow-x-hidden duration-200 border-light-section-div dark:bg-dark-distinct dark:border-dark-section-div elem-shadow-sm"
    :class="{
      'max-w-0 px-0': !menuOpen,
      'max-w-[16rem] px-4': menuOpen,
    }"
    tabindex="-1"
  >
    <div
      class="w-56 h-full py-4"
      :class="{
        hidden: !menuOpen,
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";

const target = ref<HTMLElement | null>(null);
const menuOpen = ref(false);
const ignoreElRef = ref<HTMLElement | null>(null);

const toggleMenuState = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenuState = () => {
  menuOpen.value = false;
};

onClickOutside(target, closeMenuState, { ignore: [ignoreElRef] });
</script>
