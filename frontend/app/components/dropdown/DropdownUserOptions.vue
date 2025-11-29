<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <DropdownBase
    dataTestId="dropdown-user-options"
    :isMenuButtonBold="true"
    :isMenuButtonUppercase="false"
    :location="location"
    :menuButtonIcon="IconMap.CIRCLE_PERSON"
    :menuButtonLabel="
      userIsSignedIn
        ? $t('i18n.components.dropdown_user_options.username')
        : $t('i18n.components.dropdown_user_options.join_activist')
    "
    menuButtonAriaLabel="i18n.components.dropdown_user_options.username_aria_label"
  >
    <DropdownItemsLayout
      :location="location"
      :options="userIsSignedIn ? userOptionsSignedIn : userOptionsSignedOut"
    />
  </DropdownBase>
</template>

<script setup lang="ts">
defineProps<{
  location?: DropdownLocation;
  userIsSignedIn: boolean;
}>();

const { signOut } = useAuth();
const { openModal:openModalCreateEvent } = useModalHandlers("ModalCreateEvent");
const userOptionsSignedIn: MenuSelector[] = [
  {
    id: "user-options-your-profile",
    "data-testid": "user-options-your-profile",
    label: "i18n.components.dropdown_user_options.your_profile",
    routeUrl: "/",
    iconUrl: `${IconMap.CIRCLE_PERSON}`,
    selected: false,
  },
  {
    id: "user-options-your-events",
    "data-testid": "user-options-your-events",
    label: "i18n.components.dropdown_user_options.your_events",
    routeUrl: "/",
    iconUrl: `${IconMap.EVENT}`,
    selected: false,
    onClick: () => {
      openModalCreateEvent();
    },
  },
  {
    id: "user-options-your-orgs",
    "data-testid": "user-options-your-orgs",
    label: "i18n.components.dropdown_user_options.your_orgs",
    routeUrl: "/",
    iconUrl: `${IconMap.ORGANIZATION}`,
    selected: false,
  },
  {
    id: "user-options-your-notifications",
    "data-testid": "user-options-your-notifications",
    label: "i18n._global.notifications",
    routeUrl: "/",
    iconUrl: `${IconMap.BELL}`,
    selected: false,
  },
  {
    id: "user-options-your-settings",
    "data-testid": "user-options-your-settings",
    label: "i18n._global.settings",
    routeUrl: "/",
    iconUrl: `${IconMap.SETTINGS}`,
    selected: false,
  },
  {
    id: "user-options-your-sign-out",
    "data-testid": "user-options-your-sign-out",
    label: "i18n.components.dropdown_user_options.sign_out",
    routeUrl: "/",
    iconUrl: `${IconMap.SIGN_OUT}`,
    selected: false,
    onClick: () => {
      signOut({ callbackUrl: "/", external: false });
    },
  },
];

const userOptionsSignedOut: MenuSelector[] = [
  {
    id: "user-options-sign-up",
    "data-testid": "user-options-sign-up",
    label: "i18n._global.sign_up",
    routeUrl: "/auth/sign-up",
    iconUrl: `${IconMap.SIGN_IN}`,
    selected: false,
  },
  {
    id: "user-options-sign-in",
    "data-testid": "user-options-sign-in",
    label: "i18n._global.sign_in",
    routeUrl: "/auth/sign-in",
    iconUrl: `${IconMap.CIRCLE_PERSON}`,
    selected: false,
  },
];
</script>
