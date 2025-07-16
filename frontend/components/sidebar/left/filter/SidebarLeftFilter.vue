<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="elem-shadow-sm mx-1 rounded-md bg-layer-2 pb-1 pt-1 transition-all duration-500"
  >
    <SidebarLeftFilterEvents
      v-if="sidebarTypeToDisplay === SidebarType.EVENTS_PAGE"
      :logo-url="logoUrl"
    />
  </div>
</template>

<script setup lang="ts">
import { SidebarType } from "~/types/sidebar-type";

const props = defineProps<{
  sidebarType:
    | SidebarType.ORGANIZATIONS_PAGE
    | SidebarType.EVENTS_PAGE
    | SidebarType.RESOURCES_PAGE;
  logoUrl?: string;
}>();
const logoUrl = ref(props.logoUrl);

const sidebarTypeToDisplay = computed(() => props.sidebarType);
</script>
