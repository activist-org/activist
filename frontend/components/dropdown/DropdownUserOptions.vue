<template>
  <DropdownBase
    :location="location"
    menuButtonIcon="bi:person-circle"
    :menuButtonLabel="
      userIsSignedIn
        ? $t(`components.dropdown-user-options.username`)
        : $t(`components.dropdown-user-options-join-activist`)
    "
    :isMenuButtonUppercase="false"
    :isMenuButtonBold="true"
    menuButtonAriaLabel="components.dropdown-user-options.username-aria-label"
  >
    <DropdownItemsLayout
      :location="location"
      :options="userIsSignedIn ? userOptionsSignedIn : userOptionsSignedOut"
    />
  </DropdownBase>
</template>

<script setup lang="ts">
import { DropdownLocation } from "~/types/location";
import type { MenuSelector } from "~/types/menu-selector";

defineProps<{
  location?: DropdownLocation;
  userIsSignedIn: boolean;
}>();

const userOptionsSignedIn: MenuSelector[] = [
  {
    id: 1,
    label: "components.dropdown-user-options.your-profile",
    routeURL: "/",
    iconURL: "bi:person-circle",
    selected: false,
  },
  {
    id: 2,
    label: "components.dropdown-user-options.your-events",
    routeURL: "/",
    iconURL: "bi:calendar-check",
    selected: false,
  },
  {
    id: 3,
    label: "components.dropdown-user-options.your-orgs",
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
    label: "components.dropdown-user-options.sign-out",
    routeURL: "/",
    iconURL: "bi:box-arrow-left",
    selected: false,
  },
];

const userOptionsSignedOut: MenuSelector[] = [
  {
    id: 1,
    label: "_global.sign-up",
    routeURL: "/auth/sign-up",
    iconURL: "IconJoin",
    selected: false,
  },
  {
    id: 1,
    label: "_global.sign-in",
    routeURL: "/auth/sign-in",
    iconURL: "bi:person-circle",
    selected: false,
  },
];
</script>
