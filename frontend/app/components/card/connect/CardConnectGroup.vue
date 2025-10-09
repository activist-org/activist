<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardConnect pageType="group" :socialLinks="socialLinks" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;

const groupStore = useGroupStore();
await groupStore.fetchById(groupId);
const { group } = storeToRefs(groupStore);

// Use computed to ensure social links are reactive to store changes.
const socialLinks = computed(() => group.value.socialLinks);
</script>
