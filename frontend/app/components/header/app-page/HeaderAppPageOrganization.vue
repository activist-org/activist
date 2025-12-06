<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <!-- organization.status === 1 means it's application is pending. -->
  <HeaderAppPage
    :header="headerName"
    :statusPending="organization?.status === 1"
    :tagline="headerTagline"
    :underDevelopment="underDevelopment"
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

const { data: organization } = useGetOrganization(orgId || "");

const headerName = computed<string>(() => {
  if (props.header) {
    return props.header;
  } else if (organization) {
    return organization.value?.name || "";
  } else {
    return "";
  }
});

const headerTagline = computed(() => {
  if (props.tagline) {
    return props.tagline;
  } else if (organization) {
    return organization.value?.tagline || "";
  } else {
    return "";
  }
});
</script>
