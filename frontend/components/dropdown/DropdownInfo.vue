<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <DropdownBase
    :location="location"
    :menuButtonIcon="IconMap.CIRCLE_INFO"
    :menuButtonLabel="$t(i18nMap.components.dropdown_info.info)"
    :isMenuButtonUppercase="false"
    menuButtonAriaLabel="components.dropdown_info.info_aria_label"
  >
    <DropdownItemsLayout :location="location" :options="infoOptions" />
  </DropdownBase>
</template>

<script setup lang="ts">
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";
import type { DropdownLocation } from "~/types/location";
import type { MenuSelector } from "~/types/menu/menu-selector";

defineProps<{
  location?: DropdownLocation;
}>();

const infoOptions: MenuSelector[] = [
  {
    id: 1,
    label: "components.dropdown_info.help",
    routeUrl: "/help",
    iconUrl: `${IconMap.CIRCLE_QUESTION}`,
    selected: false,
  },
  {
    id: 2,
    label: "components._global.documentation",
    routeUrl: "/docs",
    iconUrl: `${IconMap.DOCS}`,
    selected: false,
  },
  {
    id: 3,
    label: "components.dropdown_info.legal",
    routeUrl: "/legal",
    iconUrl: `${IconMap.LEGAL}`,
    selected: false,
  },
];
</script>
