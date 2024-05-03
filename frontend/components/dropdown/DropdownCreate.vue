<template>
  <DropdownBase
    :location="location"
    :menuButtonIcon="IconMap.CIRCLE_PLUS"
    :menuButtonLabel="$t(`components.dropdown-create.create`)"
    :isMenuButtonUppercase="false"
    menuButtonAriaLabel="components.dropdown-create.create-aria-label"
  >
    <DropdownItemsLayout :location="location" :options="createOptions" />
  </DropdownBase>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
import { DropdownLocation } from "~/types/location";
import type { MenuSelector } from "~/types/menu-selector";

defineProps<{
  location?: DropdownLocation;
}>();

const createOptions: MenuSelector[] = [
  {
    id: 1,
    label: "components._global.new-event",
    routeURL: "/events/create",
    iconURL: `${IconMap.EVENT}`,
    selected: false,
  },
  {
    id: 2,
    label: "components.dropdown-create.new-organization",
    routeURL: "/organizations/create",
    iconURL: "IconOrganization",
    selected: false,
  },
  {
    id: 3,
    label: "components._global.new-group",
    routeURL: "/groups/create",
    iconURL: "IconGroup",
    selected: false,
  },
  {
    id: 4,
    label: "components._global.new-resource",
    routeURL: "/resources/create",
    iconURL: "IconResource",
    selected: false,
  },
];
</script>
