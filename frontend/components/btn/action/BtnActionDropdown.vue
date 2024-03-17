<template>
  <div
    class="relative flex rounded-md md:absolute xl:rounded-lg elem-shadow-sm"
  >
    <button
      @click="emit('main-btn-clicked')"
      class="rounded-r-none shadow-none btn-base-class rounded-l-md xl:rounded-l-lg"
      :class="btnDynamicClass"
      :aria-label="$t(ariaLabel)"
    >
      <BtnIconsLabel :label="label" :leftIcon="leftIcon" :iconSize="iconSize" />
    </button>
    <Menu>
      <MenuButton
        class="border-l-0 rounded-l-none shadow-none btn-base-class rounded-r-md xl:rounded-r-lg"
        :class="btnDynamicClass"
      >
        <Icon :name="dropdownIcon" :size="iconSize" />
      </MenuButton>
      <MenuItems
        class="absolute right-0 z-40 rounded-md bg-light-layer-1 dark:bg-dark-layer-1 elem-shadow-lg ring-1 ring-black/5 top-14 focus:outline-none"
      >
        <MenuItem
          v-for="o in dropdownOptions"
          :key="o"
          v-slot="{ active }"
          class="block px-4 py-2 text-sm cursor-pointer"
          :class="{
            'rounded-t-md': o === dropdownOptions[0],
            'rounded-b-md': o === dropdownOptions[dropdownOptions.length - 1],
          }"
        >
          <button
            @click="dropdownOptionsCallback(o)"
            @keypress.enter="dropdownOptionsCallback(o)"
            tabindex="0"
            :class="{
              'bg-light-cta-orange/80 dark:bg-dark-cta-orange/40 text-light-text  dark:text-dark-cta-orange':
                active,
              'text-light-text dark:text-dark-text': !active,
            }"
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
