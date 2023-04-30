<template>
  <div
    class="flex items-center text-left transition duration-200 py-1 px-3 pr-1 mx-3 border select-none space-x-2 rounded-md bg-light-header dark:bg-dark-header border-light-special-text dark:border-dark-special-text text-light-special-text dark:text-dark-special-text"
  >
    <Icon name="bi:search" size="1em" class="my-1 flex-shrink-0 w-5 h-5" />
    <Transition name="search">
      <input
        v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
        class="w-16 bg-transparent outline-none h-5"
        type="text"
        placeholder="Search"
      />
    </Transition>
    <Transition name="shortcuts">
      <div
        v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
        class="flex space-x-1"
      >
        <div
          class="w-5 h-5 text-sm text-center rounded-md bg-light-highlight dark:bg-dark-highlight text-light-special-text dark:text-dark-special-text"
        >
          /
        </div>
        <div
          v-if="$device.isMacOS"
          class="h-5 text-sm text-center rounded-md w-7 bg-light-highlight dark:bg-dark-highlight text-light-special-text dark:text-dark-special-text"
        >
          ⌘k
        </div>
        <div
          v-else
          class="h-5 text-sm text-center border rounded-md w-7 border-light-special-text dark:border-dark-special-text text-light-special-text dark:text-dark-special-text"
        >
          ⌃k
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMagicKeys, whenever } from "@vueuse/core";
const sidebar = useSidebar();
const input = ref();
const keys = useMagicKeys();

whenever(keys.slash, () => {
  setTimeout(() => {
    input.value.focus();
  }, 0);
});
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
</style>