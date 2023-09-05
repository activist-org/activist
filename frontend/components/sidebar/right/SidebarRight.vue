<template>
  <SidebarRightHamburger
    :isMenuOpen="isMenuOpen"
    @toggle="toggleMenuState"
    ref="ignoreElRef"
    class="flex items-center h-full"
  />
  <div
    ref="target"
    id="drawer-navigation"
    class="fixed top-0 right-0 z-40 w-64 h-screen pt-12 overflow-y-auto overflow-x-hidden box-content border-l transition-[max-width] duration-200 bg-light-distinct border-light-section-div dark:bg-dark-distinct dark:border-dark-section-div shadow-sm shadow-zinc-700"
    :class="!isMenuOpen ? 'max-w-0 px-0' : 'max-w-[16rem] px-4'"
    tabindex="-1"
    >
    <div class="w-64 h-full py-4">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";

const target = ref();
const isMenuOpen = ref(false);
const ignoreElRef = ref();

const toggleMenuState = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

onClickOutside(
  target,
  () => {
    if (!isMenuOpen.value) return;
    toggleMenuState();
  },
  { ignore: [ignoreElRef] }
);
</script>
