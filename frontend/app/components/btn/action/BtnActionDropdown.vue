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
    <Menu>
      <MenuButton
        class="btn-base-class rounded-l-none rounded-r-md border-l-0 shadow-none xl:rounded-r-lg"
        :class="btnDynamicClass"
      >
        <Icon :name="dropdownIcon" :size="iconSize" />
      </MenuButton>
      <MenuItems
        class="elem-shadow-lg absolute right-0 top-14 z-40 rounded-md bg-layer-1 ring-1 ring-black/5 focus:outline-none"
      >
        <MenuItem
          v-for="o in dropdownOptions"
          :key="o"
          v-slot="{ active }"
          class="block w-full cursor-pointer px-4 py-2 text-sm"
          :class="{
            'rounded-t-md': o === dropdownOptions[0],
            'rounded-b-md': o === dropdownOptions[dropdownOptions.length - 1],
          }"
        >
          <button
            @click="dropdownOptionsCallback(o)"
            @keypress.enter="dropdownOptionsCallback(o)"
            :class="{
              'bg-cta-orange/80 text-primary-text dark:bg-cta-orange/40 dark:text-cta-orange':
                active,
              'text-primary-text': !active,
            }"
            tabindex="0"
          >
            {{ o }}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  </div>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

import type { BtnActionDropdown } from "~/types/btn-props";

import { getBtnDynamicClass } from "~/utils/btnUtils";

const props = defineProps<BtnActionDropdown>();

const btnDynamicClass = getBtnDynamicClass(props.cta, props.fontSize);

const emit = defineEmits(["main-btn-clicked"]);
</script>
