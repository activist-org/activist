<template>
  <div
    class="flex items-center justify-center py-1 pr-1 mx-3 space-x-2 border rounded-md select-none bg-light-header dark:bg-dark-header border-light-special-text dark:border-dark-special-text text-light-special-text dark:text-dark-special-text"
    :class="{
      'pl-2': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'pl-1': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    }"
  >
    <Icon name="bi:search" size="1em" class="my-1" />
    <input
      v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
      ref="input"
      class="w-16 bg-transparent outline-none"
      type="text"
      placeholder="Search"
    />
    <Transition>
      <div
        v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
        class="flex pl-1 space-x-1"
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
          class="h-5 text-sm text-center rounded-md w-7 border border-light-special-text dark:border-dark-special-text text-light-special-text dark:text-dark-special-text"
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
  input.value.focus();
  setTimeout(() => {
    if (input.value.value.startsWith("/")) {
      input.value.value = "";
    }
  }, 0);
});
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
