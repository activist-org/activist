<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <!-- organization.status === 1 means it's application is pending. -->
  <HeaderAppPage
    :header="headerName"
    :tagline="headerTagline"
    :underDevelopment="underDevelopment"
    :statusPending="organization.status === 1"
  >
    <slot />
  </HeaderAppPage>
</template>

<script setup lang="ts">
const props = defineProps<{
  header?: string;
  tagline?: string;
  underDevelopment?: boolean;
}>();

const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(orgId);
const { organization } = organizationStore;

const headerName = computed<string>(() => {
  if (props.header) {
    return props.header;
  } else if (organization) {
    return organization.name;
  } else {
    return "";
  }
});

const headerTagline = computed(() => {
  if (props.tagline) {
    return props.tagline;
  } else if (organization) {
    return organization.tagline;
  } else {
    return "";
  }
});
</script>
