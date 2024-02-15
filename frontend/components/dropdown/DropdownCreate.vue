<template>
  <DropdownBase
    :location="location"
    menuButtonAriaLabel="components.sidebar-left-footer.create-aria-label"
    menuButtonIcon="bi:plus-circle"
    :menuButtonLabel="$t(`components.sidebar-left-footer.create`)"
    :isMenuButtonUppercase="false"
  >
    <DropdownItemsLayout :location="location" :options="createOpt" />
  </DropdownBase>
</template>

<script setup lang="ts">
import { DropdownLocation } from "~/types/location";
import type { MenuSelector } from "~/types/menu-selector";

defineProps<{
  location?: DropdownLocation;
}>();

const createOpt: MenuSelector[] = [
  {
    id: 1,
    label: "components._global.new-event",
    routeURL: "/events/create",
    iconURL: "bi:calendar-check",
    selected: false,
  },
  {
    id: 2,
    label: "components.sidebar-left-selector.label.new-organization",
    routeURL: "/organizations/create",
    iconURL: "IconOrganization",
    selected: false,
  },
  {
    id: 3,
    label: "components._global.new-group",
    routeURL: "/",
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
