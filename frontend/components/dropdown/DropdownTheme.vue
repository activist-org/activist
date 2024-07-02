<template>
  <DropdownBase
    class="dropdown-theme"
    :location="location"
    :menuButtonIcon="menuButtonIcon"
    :menuButtonLabel="$t(`components.selector-theme.label`)"
    :isMenuButtonUppercase="false"
    menuButtonAriaLabel="components.selector-theme.open-dropdown-aria-label"
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
    label: "components.selector-theme.system",
    ariaLabel: "$t('components.selector-theme.system-aria-label')",
  },
  {
    optColorMode: "light",
    iconName: `${IconMap.COLOR_MODE_LIGHT}`,
    label: "components.selector-theme.light",
    ariaLabel: "$t('components.selector-theme.light-aria-label')",
  },
  {
    optColorMode: "dark",
    iconName: `${IconMap.COLOR_MODE_DARK}`,
    label: "components.selector-theme.dark",
    ariaLabel: "$t('components.selector-theme.dark-aria-label')",
  },
];

function handlerClick(optColorMode: string): void {
  colorMode.preference = optColorMode;
}
</script>
