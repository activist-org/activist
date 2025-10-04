<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    v-if="location == SearchBarLocation.SIDEBAR"
    id="search"
    class="mx-2 flex grow select-none items-center justify-between rounded-md bg-layer-2 py-1 pl-[12px] text-left text-distinct-text transition duration-200 elem-shadow-sm focus-within:mb-[-3px] focus-within:border-2 focus-within:border-link-text"
  >
    <div class="flex items-center space-x-2 pl-1">
      <Icon
        class="my-1 h-4 w-4 flex-shrink-0"
        :name="IconMap.SEARCH"
        size="1em"
      />
      <Transition name="search">
        <div
          v-show="
            sidebar.collapsed == false || sidebar.collapsedSwitch == false
          "
        >
          <label for="input-search" class="sr-only">
            {{ $t("i18n._global.search") }}
          </label>
          <input
            @focus="onFocus"
            @blur="onFocusLost"
            @input="handleChange"
            ref="input"
            id="input-search"
            :value="localValue"
            class="h-5 w-16 bg-transparent outline-none"
            :class="{ 'focus:w-5/6': isInputFocused }"
            type="text"
            :placeholder="$t('i18n._global.search')"
          />
        </div>
      </Transition>
    </div>
    <Transition name="shortcuts">
      <div
        v-show="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
        ref="hotkeyIndicators"
        class="transition-duration-200 flex space-x-1 pr-1 transition-opacity"
      >
        <div
          class="has-tooltip flex rounded-md bg-highlight px-2 py-[0.125rem] text-center text-sm text-distinct-text"
        >
          <TooltipBase
            class="invisible -mt-8"
            :text="$t('i18n.components._global.slash_tooltip_label')"
          />
          <p class="-mt-[0.075rem]">
            <!-- Preserve line break. -->
            /
          </p>
        </div>
        <div
          v-if="isMacOS"
          class="has-tooltip flex rounded-md bg-highlight px-2 py-[0.125rem] text-center text-sm text-distinct-text"
        >
          <TooltipBase
            class="invisible -mt-8"
            :text="$t('i18n.components._global.command_tooltip_label')"
          />
          <p>⌘k</p>
        </div>
        <div
          v-else
          class="has-tooltip flex rounded-md bg-highlight px-2 py-[0.125rem] text-center text-sm text-distinct-text"
        >
          <TooltipBase
            class="invisible -mt-8"
            :text="$t('i18n.components._global.control_tooltip_label')"
          />
          <p>⌃k</p>
        </div>
      </div>
    </Transition>
  </div>
  <div
    v-else
    id="search"
    class="relative inline-flex select-none items-center space-x-2 rounded-md border border-distinct-text bg-layer-2 py-1 pl-[12px] pr-[10px] text-left text-distinct-text focus-within:border-2 focus-within:border-cta-orange dark:border-distinct-text dark:focus-within:border-cta-orange"
  >
    <Icon
      @click="emit('on-search-toggle')"
      id="search-toggle"
      class="my-1 h-4 w-4 flex-shrink-0"
      :name="expanded ? `${IconMap.X_LG}` : `${IconMap.SEARCH}`"
      size="1em"
    />
    <label for="input-search" class="hidden md:block">
      {{ $t("i18n._global.search") }}
    </label>
    <input
      @input="handleChange"
      id="input-search"
      class="bg-transparent focus:outline-none"
      :class="{ hidden: !expanded }"
      type="text"
      :placeholder="$t('i18n._global.search')"
      :value="localValue"
    />
    <Icon v-if="expanded" class="absolute right-3" :name="IconMap.FILTER" />
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "#shared/types/icon-map";
import { SearchBarLocation } from "#shared/types/location";
import { useActiveElement, useMagicKeys, whenever } from "@vueuse/core";

export interface Props {
  location: SearchBarLocation;
  expanded?: boolean;
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false,
});

const localValue = ref(props.modelValue || "");
watch(
  props,
  (newVal) => {
    localValue.value = newVal.modelValue || "";
  },
  { immediate: true }
);
const sidebar = useSidebar();
const { isMacOS } = useDevice();

const input = ref();
const activeElement = useActiveElement();
const hotkeyIndicators = ref();
const isInputFocused = ref(false);
const notUsingTextEditor = computed(
  () =>
    !activeElement.value?.classList?.contains("tiptap") &&
    activeElement.value?.tagName !== "INPUT" &&
    activeElement.value?.tagName !== "TEXTAREA"
);

const { slash } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (
      e.key === "/" &&
      e.type === "keydown" &&
      !activeElement.value?.classList?.contains("tiptap") &&
      activeElement.value?.tagName !== "INPUT" &&
      activeElement.value?.tagName !== "TEXTAREA"
    )
      e.preventDefault();
  },
});

whenever(logicAnd(slash, notUsingTextEditor), () => {
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

const emit = defineEmits(["on-search-toggle", "update:modelValue"]);
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
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
