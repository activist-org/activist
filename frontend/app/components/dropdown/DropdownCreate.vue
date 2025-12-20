<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <DropdownBase
    :isMenuButtonUppercase="false"
    :location="location"
    :menuButtonIcon="IconMap.CIRCLE_PLUS"
    :menuButtonLabel="$t('i18n.components.dropdown_create.create')"
    menuButtonAriaLabel="i18n.components.dropdown_create.create_aria_label"
  >
    <DropdownItemsLayout :location="location" :options="createOptions" />
  </DropdownBase>
</template>

<script setup lang="ts">
defineProps<{
  location?: DropdownLocation;
}>();
const { openModal: openModalCreateEvent } =
  useModalHandlers("ModalCreateEvent");

const { openModal: openModalCreateOrganization } = useModalHandlers(
  "ModalCreateOrganization"
);

const { openModal: openModalCreateGroup } =
  useModalHandlers("ModalCreateGroup");

const createOptions: MenuSelector[] = [
  {
    id: 1,
    label: "i18n._global.new_event",
    iconUrl: `${IconMap.EVENT}`,
    selected: false,
    onClick: () => {
      openModalCreateEvent();
    },
  },
  {
    id: 2,
    label: "i18n.components.dropdown_create.new_organization",
    iconUrl: "IconOrganization",
    selected: false,
    onClick: () => {
      openModalCreateOrganization();
    },
  },
  {
    id: 3,
    label: "i18n._global.new_group",
    iconUrl: "IconGroup",
    selected: false,
    onClick: () => {
      openModalCreateGroup();
    },
  },
];
</script>
