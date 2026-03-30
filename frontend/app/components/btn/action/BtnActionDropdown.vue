<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="relative flex rounded-md elem-shadow-sm md:absolute xl:rounded-lg"
  >
    <button
      @click="emit('main-btn-clicked')"
      :aria-label="$t(ariaLabel)"
      class="btn-base-class rounded-l-md rounded-r-none shadow-none xl:rounded-l-lg"
      :class="btnDynamicClass"
    >
      <BtnIconsLabel
        :hideLabelOnMobile="hideLabelOnMobile"
        :iconSize="iconSize"
        :label="label"
        :leftIcon="leftIcon"
      />
    </button>
    <!-- Dropdown trigger (chevron button) -->
    <div ref="wrapperRef" class="relative">
      <button
        ref="triggerRef"
        @click.stop="toggleDropdown"
        :aria-label="$t(ariaLabelDropdown)"
        :aria-expanded="isOpen"
        aria-haspopup="true"
        class="btn-base-class rounded-l-none rounded-r-md border-l-0 shadow-none xl:rounded-r-lg"
        :class="btnDynamicClass"
      >
        <Icon :name="dropdownIcon" :size="iconSize" />
      </button>
      <!-- Dropdown items — teleported to body to escape modal overflow clipping -->
      <Teleport to="body">
        <div
          v-if="isOpen"
          ref="dropdownRef"
          role="menu"
          class="elem-shadow-lg fixed z-[9999] mt-2 w-max rounded-md bg-layer-1 ring-1 ring-black/5 focus:outline-none"
          :style="floatingStyle"
        >
          <button
            v-for="option in dropdownOptions"
            :key="option"
            role="menuitem"
            @click.stop="handleOptionClick(option)"
            class="block w-full cursor-pointer px-4 py-2 text-left text-sm text-primary-text first:rounded-t-md last:rounded-b-md hover:bg-cta-orange/80 hover:text-primary-text dark:hover:bg-cta-orange/40 dark:hover:text-cta-orange"
          >
            {{ option }}
          </button>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import type { BtnActionDropdown } from "#shared/types/components-props";
const props = defineProps<BtnActionDropdown>();
const btnDynamicClass = getBtnDynamicClass(props.cta, props.fontSize);
const emit = defineEmits(["main-btn-clicked"]);
const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);
function toggleDropdown() {
  isOpen.value = !isOpen.value;
}
function handleOptionClick(option: string) {
  props.dropdownOptionsCallback(option);
  isOpen.value = false;
}
onClickOutside(wrapperRef, () => {
  isOpen.value = false;
});
const floatingStyle = computed(() => {
  const el = triggerRef.value;
  if (!el) return {};
  const rect = el.getBoundingClientRect();
  return {
    top: `${rect.bottom + 8}px`,
    right: `${window.innerWidth - rect.right}px`,
  };
});
</script>
