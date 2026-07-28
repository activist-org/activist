<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardConnect
    :entity="group"
    :entityId="entityId"
    pageType="group"
    :socialLinks="socialLinks"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  group?: Group;
  entityId: string;
}>();

// Use computed to ensure social links are reactive to store changes.
const socialLinks = computed(() => props.group?.socialLinks ?? []);
</script>
