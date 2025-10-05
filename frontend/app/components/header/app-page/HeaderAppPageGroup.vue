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
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;

const groupStore = useGroupStore();
await groupStore.fetchById(groupId);
const { group } = groupStore;

const headerName = computed<string>(() => {
  if (props.header) {
    return props.header;
  } else if (group) {
    return group.name;
  } else {
    return "";
  }
});

const headerTagline = computed(() => {
  if (props.tagline) {
    return props.tagline;
  } else if (group) {
    return group.tagline;
  } else {
    return "";
  }
});
</script>
