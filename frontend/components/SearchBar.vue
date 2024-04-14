<template>
  <div
    v-if="location == SearchBarLocation.SIDEBAR"
    class="elem-shadow-sm mx-2 flex grow select-none items-center justify-between rounded-md bg-light-layer-2 py-1 pl-[12px] text-left text-light-distinct-text transition duration-200 focus-within:mb-[-3px] focus-within:border-2 focus-within:border-light-link-text dark:bg-dark-layer-2 dark:text-dark-distinct-text dark:focus-within:border-dark-link-text"
  >
    <div class="flex items-center space-x-2 pl-1">
      <Icon class="my-1 h-4 w-4 flex-shrink-0" name="bi:search" size="1em" />
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
            class="h-5 w-16 bg-transparent outline-none"
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
        class="transition-duration-200 flex space-x-1 pr-1 transition-opacity"
      >
        <div
          class="has-tooltip flex rounded-md bg-light-highlight px-2 py-[0.125rem] text-center text-sm text-light-distinct-text dark:bg-dark-highlight dark:text-dark-distinct-text"
        >
          <TooltipBase
            class="invisible -mt-8"
            :text="$t('components.search-bar.slash-tooltip-label')"
          />
          <p class="-mt-[0.075rem]">/</p>
        </div>
        <div
          v-if="$device.isMacOS"
          class="has-tooltip flex rounded-md bg-light-highlight px-2 py-[0.125rem] text-center text-sm text-light-distinct-text dark:bg-dark-highlight dark:text-dark-distinct-text"
        >
          <TooltipBase
            class="invisible -mt-8"
            :text="$t('components.search-bar.command-tooltip-label')"
          />
          <p>⌘k</p>
        </div>
        <div
          v-else
          class="has-tooltip flex rounded-md bg-light-highlight px-2 py-[0.125rem] text-center text-sm text-light-distinct-text dark:bg-dark-highlight dark:text-dark-distinct-text"
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
    class="relative inline-flex select-none items-center space-x-2 rounded-md border border-light-distinct-text bg-light-layer-2 py-1 pl-[12px] pr-[10px] text-left text-light-distinct-text focus-within:border-2 focus-within:border-light-cta-orange dark:border-dark-distinct-text dark:bg-dark-layer-2 dark:text-dark-distinct-text dark:focus-within:border-dark-cta-orange"
  >
    <Icon
      @click="emit('on-search-toggle')"
      class="my-1 h-4 w-4 flex-shrink-0"
      :name="expanded ? 'bi:x-lg' : 'bi:search'"
      size="1em"
    />
    <label for="expanded-search-input" class="hidden md:block">{{
      $t("_global.search")
    }}</label>
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
