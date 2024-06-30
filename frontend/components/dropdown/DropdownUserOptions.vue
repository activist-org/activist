<template>
  <DropdownBase
    :location="location"
    :menuButtonIcon="IconMap.CIRCLE_PERSON"
    :menuButtonLabel="
      userIsSignedIn
        ? $t(`components.dropdown-user-options.username`)
        : $t(`components.dropdown-user-options.join-activist`)
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
import { IconMap } from "~/types/icon-map";
import { DropdownLocation } from "~/types/location";
import type { MenuSelector } from "~/types/menu/menu-selector";

defineProps<{
  location?: DropdownLocation;
  userIsSignedIn: boolean;
}>();

const userOptionsSignedIn: MenuSelector[] = [
  {
    id: 1,
    label: "components.dropdown-user-options.your-profile",
    routeURL: "/",
    iconURL: `${IconMap.CIRCLE_PERSON}`,
    selected: false,
  },
  {
    id: 2,
    label: "components.dropdown-user-options.your-events",
    routeURL: "/",
    iconURL: `${IconMap.EVENT}`,
    selected: false,
  },
  {
    id: 3,
    label: "components.dropdown-user-options.your-orgs",
    routeURL: "/",
    iconURL: `${IconMap.ORGANIZATION}`,
    selected: false,
  },
  {
    id: 4,
    label: "_global.notifications",
    routeURL: "/",
    iconURL: `${IconMap.BELL}`,
    selected: false,
  },
  {
    id: 5,
    label: "_global.settings",
    routeURL: "/",
    iconURL: `${IconMap.SETTINGS}`,
    selected: false,
  },
  {
    id: 6,
    label: "components.dropdown-user-options.sign-out",
    routeURL: "/",
    iconURL: `${IconMap.SIGN_OUT}`,
    selected: false,
  },
];

const userOptionsSignedOut: MenuSelector[] = [
  {
    id: 1,
    label: "_global.sign-up",
    routeURL: "/auth/sign-up",
    iconURL: `${IconMap.SIGN_IN}`,
    selected: false,
  },
  {
    id: 1,
    label: "_global.sign-in",
    routeURL: "/auth/sign-in",
    iconURL: `${IconMap.CIRCLE_PERSON}`,
    selected: false,
  },
];
</script>
