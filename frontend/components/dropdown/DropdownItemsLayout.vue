<template>
  <ul
    :class="{
      'space-y-1': isSideLeftMenu,
      'px-2 py-2': isSideMenu,
    }"
  >
    <MenuLinkWrapper
      v-for="opt in options"
      :key="opt.id"
      :id="getSelectorId(opt.label)"
      :to="opt.routeURL"
      :selected="opt.selected"
      :isAddStyles="false"
    >
      <MenuItem v-slot="{ active }" class="flex">
        <MenuItemLabel
          :isSideLeftMenu="isSideLeftMenu"
          :isButton="false"
          :label="$t(`${opt.label}`)"
          :iconName="opt.iconURL"
          :active="active"
        />
      </MenuItem>
    </MenuLinkWrapper>
  </ul>
</template>

<script setup lang="ts">
import { MenuItem } from "@headlessui/vue";
import { DropdownLocation } from "~/types/location";
import type { MenuSelector } from "~/types/menu/menu-selector";

const props = defineProps<{
  location?: DropdownLocation;
  options: MenuSelector[];
}>();

const isSideLeftMenu = computed(() => {
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
