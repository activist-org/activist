<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="relative flex rounded-md elem-shadow-sm md:absolute xl:rounded-lg"
  >
    <button
      @click.stop="emit('main-btn-clicked')"
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
    <Menu as="div" class="relative">
      <MenuButton
        :aria-label="$t(ariaLabelDropdown)"
        class="btn-base-class rounded-l-none rounded-r-md border-l-0 shadow-none xl:rounded-r-lg"
        :class="btnDynamicClass"
      >
        <Icon :name="dropdownIcon" :size="iconSize" />
      </MenuButton>
      <MenuItems
        class="elem-shadow-lg absolute right-0 top-full z-[100] mt-2 w-max rounded-md bg-layer-1 ring-1 ring-black/5 focus:outline-none"
      >
        <MenuItem
          v-for="option in dropdownOptions"
          :key="option"
          v-slot="{ active }"
          @click="dropdownOptionsCallback(option)"
        >
          <BtnAction
            :ariaLabel="option"
            class="block w-full cursor-pointer px-4 py-2 text-left text-sm"
            :class="[
              option === dropdownOptions[0] ? 'rounded-t-md' : '',
              option === dropdownOptions[dropdownOptions.length - 1]
                ? 'rounded-b-md'
                : '',
              active
                ? 'bg-cta-orange/80 text-primary-text dark:bg-cta-orange/40 dark:text-cta-orange'
                : 'text-primary-text',
            ]"
            :cta="true"
            fontSize="base"
            :label="option"
          />
        </MenuItem>
      </MenuItems>
    </Menu>
  </div>
</template>

<script setup lang="ts">
import type { BtnActionDropdown } from "#shared/types/components-props";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

const props = defineProps<BtnActionDropdown>();

const btnDynamicClass = getBtnDynamicClass(props.cta, props.fontSize);

const emit = defineEmits(["main-btn-clicked"]);
</script>
