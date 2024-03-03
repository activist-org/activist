<template>
  <DropdownBase
    :location="location"
    menuButtonAriaLabel="components.selector-theme.open-dropdown-aria-label"
    :menuButtonIcon="menuButtonIcon"
    :menuButtonLabel="$t(`components.selector-theme.label`)"
    :isMenuButtonUppercase="false"
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
          :ariaLabel="opt.ariaLabel"
          :label="$t(`${opt.label}`)"
          :active="active"
        />
      </MenuItem>
    </div>
  </DropdownBase>
</template>

<script setup lang="ts">
import { MenuItem } from "@headlessui/vue";
import { computed } from "vue";
import { DropdownLocation } from "~/types/location";

defineProps<{
  location?: DropdownLocation;
}>();

const colorMode = useColorMode();

const menuButtonIcon = computed(() => {
  if (colorMode.preference == "system") {
    return "bi:circle-half";
  } else if (colorMode.preference == "light") {
    return "bi:sun";
  } else return "bi:moon";
});

const labelsOpt = [
  {
    optColorMode: "system",
    iconName: "bi:circle-half",
    label: "components.selector-theme.system",
    ariaLabel: "$t('components.selector-theme.system-aria-label')",
  },
  {
    optColorMode: "light",
    iconName: "bi:sun",
    label: "components.selector-theme.light",
    ariaLabel: "$t('components.selector-theme.light-aria-label')",
  },
  {
    optColorMode: "dark",
    iconName: "bi:moon",
    label: "components.selector-theme.dark",
    ariaLabel: "$t('components.selector-theme.dark-aria-label')",
  },
];

function handlerClick(optColorMode: string): void {
  colorMode.preference = optColorMode;
}
</script>
