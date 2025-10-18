<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardConnect pageType="group" :socialLinks="socialLinks" />
</template>

<script setup lang="ts">
import { useGetGroup } from "~/composables/queries/useGetGroup";

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : "";

const { data: group } = useGetGroup(groupId);

// Use computed to ensure social links are reactive to store changes.
const socialLinks = computed(() => group.value?.socialLinks ?? []);
</script>
