<template>
  <div
    class="py-2 mx-1 transition-all motion-reduce:transition-none duration-500 text-light-text dark:text-dark-text bg-light-layer-2 dark:bg-dark-layer-2 elem-shadow-sm rounded-md"
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
        <ImageOrganization class="elem-shadow-sm" :imgURL="logoUrl" />
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
        <ImageEvent class="elem-shadow-sm" eventType="action" />
      </div>
      <ul
        class="flex flex-col w-full px-1 mb-1"
        :class="{
          'mt-4':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'mt-2': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
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
import { SidebarType } from "~/types/sidebar-type";

defineProps<{
  name: string;
  sidebarType: SidebarType.ORGANIZATION_PAGE | SidebarType.EVENT_PAGE;
  logoUrl?: string;
}>();

const sidebar = useSidebar();
const menuEntriesState = useMenuEntriesState();
</script>
