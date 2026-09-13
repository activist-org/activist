<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="mx-1 rounded-md bg-layer-2 pb-1 pt-1 transition-all duration-500 elem-shadow-sm"
  >
    <SidebarLeftFilterEvents
      v-if="sidebarTypeToDisplay === sidebarEventPage"
      :logo-url="logoUrl"
    />
    <SidebarLeftFilterOrganization
      v-if="sidebarTypeToDisplay === sidebarOrganizationPage"
      :logo-url="logoUrl"
    />
  </div>
</template>

<script setup lang="ts">
const sidebarOrganizationPage = SidebarMap.ORGANIZATIONS_PAGE;
const sidebarEventPage = SidebarMap.EVENTS_PAGE;

const props = defineProps<{
  sidebarType:
    typeof SidebarMap.EVENTS_PAGE | typeof SidebarMap.ORGANIZATIONS_PAGE;
  logoUrl?: string;
}>();

const logoUrl = ref(props.logoUrl);

const sidebarTypeToDisplay = computed(() => props.sidebarType);
</script>
