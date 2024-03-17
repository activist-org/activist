<template>
  <div
    v-if="location == SearchBarLocation.SIDEBAR"
    class="flex justify-between grow items-center pl-[12px] py-1 mx-2 text-left transition duration-200 rounded-md select-none text-light-distinct-text dark:text-dark-distinct-text focus-within:border-light-link-text focus-within:border-2 dark:focus-within:border-dark-link-text focus-within:mb-[-3px] bg-light-layer-2 dark:bg-dark-layer-2 elem-shadow-sm"
  >
    <div class="flex items-center pl-1 space-x-2">
      <Icon class="flex-shrink-0 w-4 h-4 my-1" name="bi:search" size="1em" />
      <Transition name="search">
        <div
          v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
        >
          <label for="input-search" class="sr-only">{{
            $t("_global.search")
          }}</label>
          <input
            @focus="onFocus"
            @blur="onFocusLost"
            ref="input"
            id="input-search"
            class="w-16 h-5 bg-transparent outline-none"
            :class="{ 'focus:w-5/6': isInputFocused }"
            type="text"
            :placeholder="$t('_global.search')"
          />
        </div>
      </Transition>
    </div>
    <Transition name="shortcuts">
      <div
        v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
        ref="hotkeyIndicators"
        class="flex pr-1 space-x-1 transition-opacity transition-duration-200"
      >
        <div
          class="flex px-2 py-[0.125rem] text-sm text-center rounded-md has-tooltip bg-light-highlight dark:bg-dark-highlight text-light-distinct-text dark:text-dark-distinct-text"
        >
          <TooltipBase
            class="invisible -mt-8"
            :text="$t('components.search-bar.slash-tooltip-label')"
          />
          <p class="-mt-[0.075rem]">/</p>
        </div>
        <div
          v-if="$device.isMacOS"
          class="flex px-2 py-[0.125rem] text-sm text-center rounded-md has-tooltip bg-light-highlight dark:bg-dark-highlight text-light-distinct-text dark:text-dark-distinct-text"
        >
          <TooltipBase
            class="invisible -mt-8"
            :text="$t('components.search-bar.command-tooltip-label')"
          />
          <p>⌘k</p>
        </div>
        <div
          v-else
          class="flex px-2 py-[0.125rem] text-sm text-center rounded-md has-tooltip bg-light-highlight dark:bg-dark-highlight text-light-distinct-text dark:text-dark-distinct-text"
        >
          <TooltipBase
            class="invisible -mt-8"
            :text="$t('components.search-bar.control-tooltip-label')"
          />
          <p>⌃k</p>
        </div>
      </div>
    </Transition>
  </div>
  <div
    v-else
    class="relative inline-flex items-center pl-[12px] pr-[10px] py-1 space-x-2 text-left border rounded-md select-none bg-light-layer-2 dark:bg-dark-layer-2 border-light-distinct-text dark:border-dark-distinct-text text-light-distinct-text dark:text-dark-distinct-text focus-within:border-light-cta-orange focus-within:border-2 dark:focus-within:border-dark-cta-orange"
  >
    <Icon
      @click="emit('on-search-toggle')"
      class="flex-shrink-0 w-4 h-4 my-1"
      :name="expanded ? 'bi:x-lg' : 'bi:search'"
      size="1em"
    />
    <label for="expanded-search-input">{{ $t("_global.search") }}</label>
    <input
      v-if="expanded"
      id="expanded-search-input"
      class="bg-transparent focus:outline-none"
      type="text"
      :placeholder="$t('_global.search')"
    />
    <Icon v-if="expanded" class="absolute right-3" name="bi:filter" />
  </div>
</template>

<script setup lang="ts">
import { useMagicKeys, whenever } from "@vueuse/core";
import { SearchBarLocation } from "~/types/location";

export interface Props {
  location: SearchBarLocation;
  expanded?: boolean;
}

withDefaults(defineProps<Props>(), {
  expanded: false,
});

const sidebar = useSidebar();
const input = ref();
const hotkeyIndicators = ref();
const isInputFocused = ref(false);
const { slash } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === "/" && e.type === "keydown") e.preventDefault();
  },
});

whenever(slash, () => {
  setTimeout(() => {
    if (input.value) {
      input.value.focus();
    }
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
