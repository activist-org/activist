<template>
  <DropdownBase
    :location="location"
    :menuButtonIcon="IconMap.CIRCLE_INFO"
    :menuButtonLabel="$t(`components.dropdown-info.info`)"
    :isMenuButtonUppercase="false"
    menuButtonAriaLabel="components.dropdown-info.info-aria-label"
  >
    <DropdownItemsLayout :location="location" :options="infoOptions" />
  </DropdownBase>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
import { DropdownLocation } from "~/types/location";
import type { MenuSelector } from "~/types/menu/menu-selector";

defineProps<{
  location?: DropdownLocation;
}>();

const infoOptions: MenuSelector[] = [
  {
    id: 1,
    label: "_global.help",
    routeURL: "/help",
    iconURL: `${IconMap.CIRCLE_QUESTION}`,
    selected: false,
  },
  {
    id: 2,
    label: "_global.documentation",
    routeURL: "/docs",
    iconURL: `${IconMap.DOCS}`,
    selected: false,
  },
  {
    id: 3,
    label: "_global.legal",
    routeURL: "/legal",
    iconURL: `${IconMap.LEGAL}`,
    selected: false,
  },
];
</script>
