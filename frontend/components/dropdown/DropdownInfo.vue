<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <DropdownBase
    :location="location"
    :menuButtonIcon="IconMap.CIRCLE_INFO"
    :menuButtonLabel="$t('i18n._global.info')"
    :isMenuButtonUppercase="false"
    menuButtonAriaLabel="i18n._global.info_aria_label"
  >
    <DropdownItemsLayout :location="location" :options="infoOptions" />
  </DropdownBase>
</template>

<script setup lang="ts">
import type { DropdownLocation } from "~/types/location";
import type { MenuSelector } from "~/types/menu/menu-selector";

import { IconMap } from "~/types/icon-map";

defineProps<{
  location?: DropdownLocation;
}>();

const infoOptions: MenuSelector[] = [
  {
    id: 1,
    label: "i18n.components.dropdown_info.help",
    routeUrl: "/help",
    iconUrl: `${IconMap.CIRCLE_QUESTION}`,
    selected: false,
  },
  {
    id: 2,
    label: "i18n.components._global.documentation",
    routeUrl: "/docs",
    iconUrl: `${IconMap.DOCS}`,
    selected: false,
  },
  {
    id: 3,
    label: "i18n.components.dropdown_info.legal",
    routeUrl: "/legal",
    iconUrl: `${IconMap.LEGAL}`,
    selected: false,
  },
];
</script>
