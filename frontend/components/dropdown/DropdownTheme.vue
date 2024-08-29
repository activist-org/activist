<template>
  <DropdownBase
    class="dropdown-theme"
    :location="location"
    :menuButtonIcon="menuButtonIcon"
    :menuButtonLabel="$t(`components.dropdown_theme.label`)"
    :isMenuButtonUppercase="false"
    menuButtonAriaLabel="components.dropdown_theme.open_dropdown_aria_label"
  >
    <div class="px-2 py-2">
      <MenuItem
        v-for="opt in labelsOpt"
        :key="opt.optColorMode"
        v-slot="{ active }"
      >
        <MenuItemLabel
          :isButton="true"
          :handlerClick="() => handlerClick(opt.optColorMode)"
          :iconName="opt.iconName"
          :label="$t(`${opt.label}`)"
          :active="active"
          :ariaLabel="opt.ariaLabel"
        />
      </MenuItem>
    </div>
  </DropdownBase>
</template>

<script setup lang="ts">
import { MenuItem } from "@headlessui/vue";
import { computed } from "vue";
import { IconMap } from "~/types/icon-map";
import { DropdownLocation } from "~/types/location";

defineProps<{
  location?: DropdownLocation;
}>();

const colorMode = useColorMode();

const menuButtonIcon = computed(() => {
  if (colorMode.preference == "system") {
    return `${IconMap.COLOR_MODE_SYSTEM}`;
  } else if (colorMode.preference == "light") {
    return `${IconMap.COLOR_MODE_LIGHT}`;
  } else return `${IconMap.COLOR_MODE_DARK}`;
});

const labelsOpt = [
  {
    optColorMode: "system",
    iconName: `${IconMap.COLOR_MODE_SYSTEM}`,
    label: "components.dropdown_theme.system",
    ariaLabel: "$t('components.dropdown_theme.system_aria_label')",
  },
  {
    optColorMode: "light",
    iconName: `${IconMap.COLOR_MODE_LIGHT}`,
    label: "components.dropdown_theme.light",
    ariaLabel: "$t('components.dropdown_theme.light_aria_label')",
  },
  {
    optColorMode: "dark",
    iconName: `${IconMap.COLOR_MODE_DARK}`,
    label: "components.dropdown_theme.dark",
    ariaLabel: "$t('components.dropdown_theme.dark_aria_label')",
  },
];

function handlerClick(optColorMode: string): void {
  colorMode.preference = optColorMode;
}
</script>
