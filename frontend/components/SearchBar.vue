<template>
  <div
    v-if="location == 'sidebar'"
    class="flex items-center pl-[12px] pr-[10px] py-1 mx-2 space-x-2 text-left transition duration-200 border rounded-md select-none bg-light-header dark:bg-dark-header border-light-special-text dark:border-dark-special-text text-light-special-text dark:text-dark-special-text"
  >
    <Icon name="bi:search" size="1em" class="flex-shrink-0 w-4 h-4 my-1" />
    <Transition name="search">
      <input
        v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
        ref="input"
        class="w-16 h-5 bg-transparent outline-none"
        type="text"
        placeholder="Search"
        @focus="onFocus"
        @blur="onFocusLost"
        :class="{ 'focus:w-5/6': isInputFocused }"
      />
    </Transition>
    <Transition name="shortcuts">
      <div
        v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
        ref="hotkeyIndicators"
        class="flex space-x-1 transition-opacity transition-duration-200"
      >
        <div
          class="w-5 h-5 text-sm text-center rounded-md has-tooltip bg-light-highlight dark:bg-dark-highlight text-light-special-text dark:text-dark-special-text"
        >
          <span
            class="invisible px-2 py-1 -mt-8 rounded shadow-md shadow-zinc-700 bg-light-menu-selection dark:bg-dark-menu-selection w-max text-light-content dark:text-dark-content tooltip"
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
            class="invisible px-2 py-1 -mt-8 rounded shadow-md shadow-zinc-700 bg-light-menu-selection dark:bg-dark-menu-selection w-max text-light-content dark:text-dark-content tooltip"
            >Press "⌘ + k" to jump to a page</span
          >
          ⌘k
        </div>
        <div
          v-else
          class="h-5 text-sm text-center border rounded-md has-tooltip w-7 border-light-special-text dark:border-dark-special-text text-light-special-text dark:text-dark-special-text"
        >
          <span
            class="invisible px-2 py-1 -mt-8 rounded shadow-md shadow-zinc-700 bg-light-menu-selection dark:bg-dark-menu-selection w-max text-light-content dark:text-dark-content tooltip"
            >Press "^ + k" to jump to a page</span
          >
          ⌃k
        </div>
      </div>
    </Transition>
  </div>
  <div
    v-else
    class="flex items-center pl-[12px] pr-[10px] py-1 mx-2 space-x-2 text-left border rounded-md select-none bg-light-header dark:bg-dark-header border-light-special-text dark:border-dark-special-text text-light-special-text dark:text-dark-special-text"
  >
    <Icon name="bi:search" size="1em" class="flex-shrink-0 w-4 h-4 my-1" />
    <input v-if="expanded" type="text" placeholder="Search" />
    <MenuMeatball v-if="expanded" />
  </div>
</template>

<script setup lang="ts">
import { useMagicKeys, whenever } from "@vueuse/core";
import { ref } from "vue";
const sidebar = useSidebar();
const input = ref();
const hotkeyIndicators = ref();
const isInputFocused = ref(false);
const keys = useMagicKeys();

defineProps<{
  location: "sidebar" | "header";
  expanded: {
    default: false;
    type: boolean;
    required: false;
  };
}>();

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
  setTimeout(() => {
    isInputFocused.value = true;
    hotkeyIndicators.value.classList.add("hidden");
  }, 200);
};
const onFocusLost = () => {
  hotkeyIndicators.value.classList.remove("hidden");
  isInputFocused.value = false;
  setTimeout(() => {
    hotkeyIndicators.value.classList.remove("hide");
  }, 200);
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
  opacity: 0;
}
</style>
