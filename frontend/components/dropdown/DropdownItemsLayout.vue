<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ul
    :class="{
      'space-y-1': isSidebarLeftMenu,
      'px-2 py-2': isSideMenu,
    }"
  >
    <MenuLinkWrapper
      v-for="opt in options"
      :key="opt.id"
      :id="getSelectorId(opt.label)"
      :to="opt.routeUrl"
      :selected="opt.selected"
      :isAddStyles="false"
    >
      <MenuItem v-slot="{ active }" class="flex">
        <MenuItemLabel
          :isSidebarLeftMenu="isSidebarLeftMenu"
          :isButton="false"
          :label="$t(`${opt.label}`)"
          :iconName="opt.iconUrl"
          :active="active"
        />
      </MenuItem>
    </MenuLinkWrapper>
  </ul>
</template>

<script setup lang="ts">
import { MenuItem } from "@headlessui/vue";

import type { MenuSelector } from "~/types/menu/menu-selector";

import { DropdownLocation } from "~/types/location";

const props = defineProps<{
  location?: DropdownLocation;
  options: MenuSelector[];
}>();

const isSidebarLeftMenu = computed(() => {
  return props.location === DropdownLocation.SIDE_LEFT_MENU;
});

const isSideMenu = computed(() => {
  return props.location === DropdownLocation.SIDE_MENU;
});

const getSelectorId = (label: string) => {
  const idMap: Record<string, string> = {
    help: "help",
    doc: "docs",
    legal: "legal",
    profile: "profile",
    events: "your-events",
    orgs: "your-organizations",
    notifications: "notifications",
    settings: "settings",
    sign_out: "sign-out",
    sign_up: "sign-up",
    sign_in: "sign-in",
    new_event: "create-new-event",
    new_organization: "create-new-organization",
    new_group: "create-new-group",
    new_resource: "create-new-resource",
  };

  const key = Object.keys(idMap).find((k) => label.includes(k));
  return key ? idMap[key] : undefined;
};
</script>
