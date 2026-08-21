<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="mx-1 rounded-md bg-layer-2 pb-1 pt-2 transition-all duration-500 elem-shadow-sm"
  >
    <SidebarLeftContentOrganization
      v-if="sidebarTypeToDisplay === sidebarOrganizationPage"
      :logo-url="logoUrl"
      :name="props.name"
    />
    <SidebarLeftContentEvent
      v-else-if="sidebarTypeToDisplay === sidebarEventPage"
      :logo-url="logoUrl"
      :name="props.name"
    />
    <!-- <SidebarLeftContentGroupPage
      v-else-if="sidebarTypeToDisplay === sidebarGroupPage"
      :logo-url="logoUrl"
      :name="props.name"
    /> -->
  </div>
</template>

<script setup lang="ts">
// const sidebarGroupPage = SidebarType.GROUP_PAGE
const sidebarOrganizationPage = SidebarType.ORGANIZATION_PAGE;
const sidebarEventPage = SidebarType.EVENT_PAGE;
const props = defineProps<{
  name: string;
  sidebarType:
    typeof SidebarType.ORGANIZATION_PAGE | typeof SidebarType.EVENT_PAGE;
  // | typeof SidebarType.GROUP_PAGE;
  logoUrl?: string;
}>();

const logoUrl = ref(props.logoUrl);

const sidebarTypeToDisplay = computed(() => props.sidebarType);
</script>
