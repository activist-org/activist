<template>
  <div
    v-if="location == 'sidebar'"
    class="flex justify-between grow items-center pl-[12px] py-1 mx-2 text-left transition duration-200 border rounded-md select-none border-light-special-text dark:border-dark-special-text text-light-special-text dark:text-dark-special-text focus-within:border-light-cta-orange focus-within:border-2 dark:focus-within:border-dark-cta-orange focus-within:mb-[-2px]"
  >
    <div class="flex items-center space-x-2">
      <Icon class="flex-shrink-0 w-4 h-4 my-1" name="bi:search" size="1em" />
      <Transition name="search">
        <input
          v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
          @focus="onFocus"
          @blur="onFocusLost"
          ref="input"
          class="w-16 h-5 bg-transparent outline-none"
          :class="{ 'focus:w-5/6': isInputFocused }"
          type="text"
          :placeholder="$t('components.search-bar.placeholder')"
        />
      </Transition>
    </div>
    <Transition name="shortcuts">
      <div
        v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
        ref="hotkeyIndicators"
        class="flex pr-1 space-x-1 transition-opacity transition-duration-200"
      >
        <div
          class="flex px-2 py-[0.125rem] text-sm text-center rounded-md has-tooltip bg-light-highlight dark:bg-dark-highlight text-light-special-text dark:text-dark-special-text"
        >
          <Tooltip
            class="invisible -mt-8"
            :text="$t('components.search-bar.slash-tooltip-label')"
          />
          <p class="-mt-[0.075rem]">/</p>
        </div>
        <!-- <div
          v-if="$device.isMacOS"
          class="flex px-2 py-[0.125rem] text-sm text-center rounded-md has-tooltip bg-light-highlight dark:bg-dark-highlight text-light-special-text dark:text-dark-special-text"
        >
          <Tooltip
            class="invisible -mt-8"
            :text="$t('components.search-bar.command-tooltip-label')"
          />
          <p>⌘k</p>
        </div>
        <div
          v-else
          class="flex px-2 py-[0.125rem] text-sm text-center border rounded-md has-tooltip border-light-special-text dark:border-dark-special-text text-light-special-text dark:text-dark-special-text"
        >
          <Tooltip
            class="invisible -mt-8"
            :text="$t('components.search-bar.control-tooltip-label')"
          />
          <p>⌃k</p>
        </div> -->
      </div>
    </Transition>
  </div>
  <div
    v-else
    class="relative inline-flex items-center pl-[12px] pr-[10px] py-1 space-x-2 text-left border rounded-md select-none bg-light-header dark:bg-dark-header border-light-special-text dark:border-dark-special-text text-light-special-text dark:text-dark-special-text focus-within:border-light-cta-orange focus-within:border-2 dark:focus-within:border-dark-cta-orange"
  >
    <Icon
      @click="emit('on-search-toggle')"
      class="flex-shrink-0 w-4 h-4 my-1"
      :name="expanded ? 'bi:x-lg' : 'bi:search'"
      size="1em"
    />
    <input
      v-if="expanded"
      class="bg-transparent focus:outline-none"
      type="text"
      placeholder="Search"
    />
    <Icon v-if="expanded" class="absolute right-3" name="bi:filter" />
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

export interface Props {
  location: "sidebar" | "header";
  expanded?: boolean;
}

withDefaults(defineProps<Props>(), {
  expanded: false,
});

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

const emit = defineEmits(["on-search-toggle"]);
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
