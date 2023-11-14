<template>
  <div
    class="mx-1 transition-all duration-500 text-light-text dark:text-dark-text"
  >
    <div class="flex flex-col items-center">
      <div
        v-if="sidebarType === SidebarType.ORGANIZATION_PAGE"
        :class="{
          'w-32 h-32':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'w-10 h-10':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
        :alt="name + ' logo'"
      >
        <ImageOrganization :imgURL="logoUrl" />
      </div>
      <div
        v-else-if="sidebarType === SidebarType.EVENT_PAGE"
        :class="{
          'w-32 h-32':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'w-10 h-10':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
        :alt="name + ' logo'"
      >
        <ImageEvent eventType="action" />
      </div>
      <ul class="flex flex-col w-full px-1 mt-4 mb-1">
        <li
          v-for="menuEntry in sidebarType === SidebarType.ORGANIZATION_PAGE
            ? menuEntriesState.organizationEntry.value
            : menuEntriesState.eventEntry.value"
        >
          <SidebarLeftSelector
            :label="menuEntry.label"
            :routeURL="menuEntry.routeURL"
            :iconURL="menuEntry.iconURL"
            :selected="menuEntry.selected"
            :active="menuEntry.active"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import useMenuEntriesState from "~/composables/useMenuEntriesState";
import { SidebarType } from "~/types/sidebar-type";

defineProps<{
  name: string;
  sidebarType: SidebarType.ORGANIZATION_PAGE | SidebarType.EVENT_PAGE;
  logoUrl?: string;
}>();

const sidebar = useSidebar();
const menuEntriesState = useMenuEntriesState();
</script>
