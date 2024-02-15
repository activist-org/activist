<template>
  <DropdownBase
    :location = location
    menuButtonAriaLabel="components.sidebar-left-footer.username-aria-label"
    menuButtonIcon="bi:person-circle"
    :menuButtonLabel="$t(`components.sidebar-left-footer.username`)"
    :isMenuButtonUppercase="false"
    :isMenuButtonBold="true"
  >
    <DropdownItemsLayout
      :location = location
      :options = userOpt
    />
  </DropdownBase>
</template>
  
<script setup lang="ts">
import { DropdownLocation } from "~/types/location";
import type { MenuSelector } from "~/types/menu-selector";

defineProps<{
  location?: DropdownLocation;
}>();

const userOpt: MenuSelector[] = [
  {
    id: 1,
    label: "components.sidebar-left-selector.label.your-profile",
    routeURL: "/",
    iconURL: "bi:person-circle",
    selected: false,
  },
  {
    id: 2,
    label: "components.sidebar-left-selector.label.your-events",
    routeURL: "/",
    iconURL: "bi:calendar-check",
    selected: false,
  },
  {
    id: 3,
    label: "components.sidebar-left-selector.label.your-orgs",
    routeURL: "/",
    iconURL: "IconOrganization",
    selected: false,
  },
  {
    id: 4,
    label: "_global.notifications",
    routeURL: "/",
    iconURL: "bi:bell",
    selected: false,
  },
  {
    id: 5,
    label: "_global.settings",
    routeURL: "/",
    iconURL: "bi:gear",
    selected: false,
  },
  {
    id: 6,
    label: "components.sidebar-left-selector.label.sign-out",
    routeURL: "/",
    iconURL: "bi:box-arrow-left",
    selected: false,
  },
];

</script>
  