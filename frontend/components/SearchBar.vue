<template>
  <div
    class="flex items-center pl-[14px] pr-[10px] py-1 mx-3 space-x-2 text-left transition duration-200 border rounded-md select-none bg-light-header dark:bg-dark-header border-light-special-text dark:border-dark-special-text text-light-special-text dark:text-dark-special-text"
  >
    <Icon name="bi:search" size="1em" class="flex-shrink-0 w-4 h-4 my-1" />
    <Transition name="search">
      <input
        v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
        ref="input"
        class="w-16 focus:w-5/6 h-5 bg-transparent outline-none"
        type="text"
        placeholder="Search"
        @focus="onFocus"
        @blur="onFocusLost"
      />
    </Transition>
    <Transition name="shortcuts">
      <div
        v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
        ref="hotkeyIndicators"
        class="flex space-x-1"
      >
        <div
          class="w-5 h-5 text-sm text-center rounded-md has-tooltip bg-light-highlight dark:bg-dark-highlight text-light-special-text dark:text-dark-special-text"
        >
          <span
            class="p-1 px-2 -mt-8 rounded shadow-md shadow-zinc-700 bg-light-menu-selection dark:bg-dark-menu-selection w-max text-light-content dark:text-dark-content tooltip"
            >Press "/" to search</span
          >
          /
        </div>
        <div
          v-if="$device.isMacOS"
          v-tooltip="'You have new messages.'"
          class="h-5 text-sm text-center rounded-md has-tooltip w-7 bg-light-highlight dark:bg-dark-highlight text-light-special-text dark:text-dark-special-text"
        >
          <span
            class="p-1 px-2 -mt-8 rounded shadow-md shadow-zinc-700 bg-light-menu-selection dark:bg-dark-menu-selection w-max text-light-content dark:text-dark-content tooltip"
            >Press "⌘ + k" to jump to a page</span
          >
          ⌘k
        </div>
        <div
          v-else
          class="h-5 text-sm text-center border rounded-md has-tooltip w-7 border-light-special-text dark:border-dark-special-text text-light-special-text dark:text-dark-special-text"
        >
          <span
            class="p-1 px-2 -mt-8 rounded shadow-md shadow-zinc-700 bg-light-menu-selection dark:bg-dark-menu-selection w-max text-light-content dark:text-dark-content tooltip"
            >Press "^ + k" to jump to a page</span
          >
          ⌃k
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useMagicKeys, whenever } from "@vueuse/core";
import { ref } from "vue";
const sidebar = useSidebar();
const input = ref();
const hotkeyIndicators = ref();
const keys = useMagicKeys();

whenever(keys.slash, () => {
  setTimeout(() => {
    input.value.focus();
  }, 0);
  if (sidebar.collapsed == true && sidebar.collapsedSwitch == true) {
    sidebar.collapsed = false;
    sidebar.collapsedSwitch = false;
  }
});

const onFocus = () => {
  hotkeyIndicators.value.classList.add("hide");
};
const onFocusLost = () => {
  hotkeyIndicators.value.classList.remove("hide");
};
</script>

<style>
.search-enter-active {
  transition: opacity 0.25s ease;
  transition-delay: 0.125s;
}
.search-leave-active {
  transition: opacity 0.25s ease;
}

.search-enter-from,
.search-leave-to {
  opacity: 0;
}
.search-enter-from {
  transition-delay: 0.25s;
}

.shortcuts-enter-active {
  transition: opacity 0.25s ease;
  transition-delay: 0.375s;
}
.shortcuts-leave-active {
  transition: opacity 0.125s ease;
}

.shortcuts-enter-from,
.shortcuts-leave-to {
  opacity: 0;
}

.hide {
  display: none;
}
</style>
