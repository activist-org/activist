<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardConnect :socialLinks="group.socialLinks" pageType="group" />
</template>

<script setup lang="ts">
const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;

const groupStore = useGroupStore();
await groupStore.fetchById(groupId);

const { group } = groupStore;
</script>
