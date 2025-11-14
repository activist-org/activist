<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <DropdownBase
    :isMenuButtonUppercase="false"
    :location="location"
    :menuButtonIcon="IconMap.CIRCLE_INFO"
    :menuButtonLabel="$t('i18n.components.dropdown_info.info')"
    menuButtonAriaLabel="i18n.components.dropdown_info.info_aria_label"
  >
    <DropdownItemsLayout :location="location" :options="infoOptions" />
  </DropdownBase>
</template>

<script setup lang="ts">

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
