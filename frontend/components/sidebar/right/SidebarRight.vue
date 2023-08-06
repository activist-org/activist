<template>
  <SidebarRightHamburger
    :isMenuOpen="isMenuOpen"
    @toggle="toggleMenuState"
    ref="ignoreElRef"
    class="absolute h-[40px] flex top-1 right-0 mr-5"
  />
  <div
    ref="target"
    id="drawer-navigation"
    class="fixed top-0 right-0 z-40 w-64 h-screen px-4 pt-12 overflow-y-auto border-l transition-transform bg-light-distinct border-light-section-div dark:bg-dark-distinct dark:border-dark-section-div"
    :class="{ 'hidden translate-x-full': !isMenuOpen }"
    tabindex="-1"
  >
    <div class="h-full py-4">
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
