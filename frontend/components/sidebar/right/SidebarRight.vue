<template>
  <SidebarRightHamburger
    @toggle="toggleMenuState"
    ref="ignoreElRef"
    class="flex items-center h-full"
    :menuOpen="menuOpen"
  />
  <div
    ref="target"
    id="drawer-navigation"
    class="fixed top-0 right-0 z-40 h-screen pt-12 overflow-y-auto border-l bg-light-distinct transition-[max-width] overflow-x-hidden duration-200 border-light-section-div dark:bg-dark-distinct dark:border-dark-section-div elem-shadow-sm"
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
      <button
        @click="toggleMenuState"
        class="absolute left-3 top-3 w-6 h-6"
        :aria-label="$t('components.btn-action.close-navigation-aria-label')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-dark-distinct dark:stroke-light-distinct"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
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

onClickOutside(target, toggleMenuState, { ignore: [ignoreElRef] });
</script>
