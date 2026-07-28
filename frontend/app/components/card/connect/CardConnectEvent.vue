<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardConnect
    :entity="event"
    :entityId="entityId"
    pageType="event"
    :socialLinks="socialLinks"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  event?: CommunityEvent;
  entityId: string;
}>();

// Use computed to ensure social links are reactive to store changes.
const socialLinks = computed(() => props.event?.socialLinks ?? []);
</script>
