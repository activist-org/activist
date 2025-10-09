<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <DropdownBase
    class="dropdown-theme"
    :isMenuButtonUppercase="false"
    :location="location"
    :menuButtonAriaLabel="
      $t('i18n.components.dropdown_theme.open_dropdown_aria_label')
    "
    :menuButtonIcon="menuButtonIcon"
    :menuButtonLabel="$t('i18n.components.dropdown_theme.label')"
  >
    <div class="px-2 py-2">
      <MenuItem
        v-for="opt in labelsOpt"
        :key="opt.optColorMode"
        v-slot="{ active }"
      >
        <MenuItemLabel
          :active="active"
          :ariaLabel="$t(opt.ariaLabel)"
          :handlerClick="() => handlerClick(opt.optColorMode)"
          :iconName="opt.iconName"
          :isButton="true"
          :label="$t(opt.label)"
        />
      </MenuItem>
    </div>
  </DropdownBase>
</template>

<script setup lang="ts">
import { MenuItem } from "@headlessui/vue";

import type { DropdownLocation } from "~/types/location";

import { IconMap } from "~/types/icon-map";

defineProps<{
  location?: DropdownLocation;
}>();

const colorMode = useColorMode();

const menuButtonIcon = computed(() => {
  if (colorMode.preference === "system") {
    return `${IconMap.COLOR_MODE_SYSTEM}`;
  } else if (colorMode.preference === "light") {
    return `${IconMap.COLOR_MODE_LIGHT}`;
  } else return `${IconMap.COLOR_MODE_DARK}`;
});

const labelsOpt = [
  {
    optColorMode: "system",
    iconName: `${IconMap.COLOR_MODE_SYSTEM}`,
    label: "i18n.components.dropdown_theme.system",
    ariaLabel: "i18n.components.dropdown_theme.system_aria_label",
  },
  {
    optColorMode: "light",
    iconName: `${IconMap.COLOR_MODE_LIGHT}`,
    label: "i18n.components.dropdown_theme.light",
    ariaLabel: "i18n.components.dropdown_theme.light_aria_label",
  },
  {
    optColorMode: "dark",
    iconName: `${IconMap.COLOR_MODE_DARK}`,
    label: "i18n.components.dropdown_theme.dark",
    ariaLabel: "i18n.components.dropdown_theme.dark_aria_label",
  },
];

function handlerClick(optColorMode: string): void {
  colorMode.preference = optColorMode;
}
</script>
