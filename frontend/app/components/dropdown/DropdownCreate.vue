<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <DropdownBase
    :location="location"
    :menuButtonIcon="IconMap.CIRCLE_PLUS"
    :menuButtonLabel="$t('i18n.components.dropdown_create.create')"
    :isMenuButtonUppercase="false"
    menuButtonAriaLabel="i18n.components.dropdown_create.create_aria_label"
  >
    <DropdownItemsLayout :location="location" :options="createOptions" />
  </DropdownBase>
</template>

<script setup lang="ts">
import type { DropdownLocation } from "~/types/location";
import type { MenuSelector } from "~/types/menu/menu-selector";

import { IconMap } from "~/types/icon-map";

defineProps<{
  location?: DropdownLocation;
}>();

const createOptions: MenuSelector[] = [
  {
    id: 1,
    label: "i18n._global.new_event",
    routeUrl: "/events/create",
    iconUrl: `${IconMap.EVENT}`,
    selected: false,
  },
  {
    id: 2,
    label: "i18n.components.dropdown_create.new_organization",
    routeUrl: "/organizations/create",
    iconUrl: "IconOrganization",
    selected: false,
  },
  {
    id: 3,
    label: "i18n._global.new_group",
    routeUrl: "/groups/create",
    iconUrl: "IconGroup",
    selected: false,
  },
  {
    id: 4,
    label: "i18n._global.new_resource",
    routeUrl: "/resources/create",
    iconUrl: "IconResource",
    selected: false,
  },
];
</script>
