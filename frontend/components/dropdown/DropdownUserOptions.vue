<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <DropdownBase
    :location="location"
    :menuButtonIcon="IconMap.CIRCLE_PERSON"
    :menuButtonLabel="
      userIsSignedIn
        ? $t(i18nMap.components.dropdown_user_options.username)
        : $t(i18nMap.components.dropdown_user_options.join_activist)
    "
    :isMenuButtonUppercase="false"
    :isMenuButtonBold="true"
    :menuButtonAriaLabel="
      i18nMap.components.dropdown_user_options.username_aria_label
    "
  >
    <DropdownItemsLayout
      :location="location"
      :options="userIsSignedIn ? userOptionsSignedIn : userOptionsSignedOut"
    />
  </DropdownBase>
</template>

<script setup lang="ts">
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";
import type { DropdownLocation } from "~/types/location";
import type { MenuSelector } from "~/types/menu/menu-selector";

defineProps<{
  location?: DropdownLocation;
  userIsSignedIn: boolean;
}>();

const userOptionsSignedIn: MenuSelector[] = [
  {
    id: 1,
    label: i18nMap.components.dropdown_user_options.your_profile,
    routeUrl: "/",
    iconUrl: `${IconMap.CIRCLE_PERSON}`,
    selected: false,
  },
  {
    id: 2,
    label: i18nMap.components.dropdown_user_options.your_events,
    routeUrl: "/",
    iconUrl: `${IconMap.EVENT}`,
    selected: false,
  },
  {
    id: 3,
    label: i18nMap.components.dropdown_user_options.your_orgs,
    routeUrl: "/",
    iconUrl: `${IconMap.ORGANIZATION}`,
    selected: false,
  },
  {
    id: 4,
    label: i18nMap._global.notifications,
    routeUrl: "/",
    iconUrl: `${IconMap.BELL}`,
    selected: false,
  },
  {
    id: 5,
    label: i18nMap._global.settings,
    routeUrl: "/",
    iconUrl: `${IconMap.SETTINGS}`,
    selected: false,
  },
  {
    id: 6,
    label: i18nMap.components.dropdown_user_options.sign_out,
    routeUrl: "/",
    iconUrl: `${IconMap.SIGN_OUT}`,
    selected: false,
  },
];

const userOptionsSignedOut: MenuSelector[] = [
  {
    id: 1,
    label: i18nMap._global.sign_up,
    routeUrl: "/auth/sign-up",
    iconUrl: `${IconMap.SIGN_IN}`,
    selected: false,
  },
  {
    id: 1,
    label: i18nMap._global.sign_in,
    routeUrl: "/auth/sign-in",
    iconUrl: `${IconMap.CIRCLE_PERSON}`,
    selected: false,
  },
];
</script>
