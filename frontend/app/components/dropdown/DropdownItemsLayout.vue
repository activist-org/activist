<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ul
    :class="{
      'space-y-1': isSidebarLeftMenu,
      'px-2 py-2': isSideMenu,
    }"
  >
    <MenuLinkWrapper
      :id="opt.id"
      v-for="opt in options"
      :key="opt.id"
      :data-testid="opt['data-testid']"
      :isAddStyles="false"
      :selected="opt.selected"
      :to="opt.routeUrl"
    >
      <MenuItem v-slot="{ active }" class="flex">
        <MenuItemLabel
          :active="active"
          :handlerClick="opt?.onClick"
          :iconName="opt.iconUrl"
          :isButton="false"
          :isSidebarLeftMenu="isSidebarLeftMenu"
          :label="$t(`${opt.label}`)"
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
</script>
