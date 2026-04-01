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

/**
 * Handles the click event for changing the color mode. This function is called when a user selects a different color mode from the dropdown menu. It takes the selected color mode as an argument and updates the colorMode preference accordingly. This allows users to switch between system, light, and dark themes based on their preference, providing a customizable user experience.
 * @param optColorMode The selected color mode option, which can be "system", "light", or "dark". This value is used to update the colorMode preference in the application, allowing the theme to change based on the user's selection from the dropdown menu.
 */
function handlerClick(optColorMode: string): void {
  colorMode.preference = optColorMode;
}
</script>
