<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <HeaderAppPage
    :header="headerName"
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

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : "";

const { data: group } = useGetGroup(groupId);

const headerName = computed<string>(() => {
  if (props.header) {
    return props.header;
  } else if (group) {
    return group.value?.name ?? "";
  } else {
    return "";
  }
});

const headerTagline = computed(() => {
  if (props.tagline) {
    return props.tagline;
  } else if (group) {
    return group.value?.tagline ?? "";
  } else {
    return "";
  }
});
</script>
