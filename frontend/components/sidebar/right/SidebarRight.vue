<template>
  <SidebarRightToggle
    @toggle="toggleMenuState"
    ref="ignoreElRef"
    class="flex h-full items-center"
    :menuOpen="menuOpen"
  />
  <div
    ref="target"
    id="drawer-navigation"
    class="elem-shadow-sm fixed right-0 top-0 z-30 h-screen overflow-y-auto overflow-x-hidden border-l border-light-section-div bg-light-layer-1 pt-12 transition-[max-width] duration-200 dark:border-dark-section-div dark:bg-dark-layer-1"
    :class="{
      'max-w-0 px-0': !menuOpen,
      'max-w-[16rem] px-4': menuOpen,
    }"
    tabindex="-1"
  >
    <div
      class="h-full w-56 py-4"
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
import { watch } from "vue";

const target = ref<HTMLElement | null>(null);
const menuOpen = ref(false);
const ignoreElRef = ref<HTMLElement | null>(null);

const toggleMenuState = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenuState = () => {
  menuOpen.value = false;
};

const route = useRoute();
watch(() => route.path, closeMenuState);

onClickOutside(target, closeMenuState, { ignore: [ignoreElRef] });
</script>
