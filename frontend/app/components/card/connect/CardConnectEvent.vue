<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardConnect :entity="event" pageType="event" :socialLinks="socialLinks" />
</template>

<script setup lang="ts">
const props = defineProps<{
  event: CommunityEvent | null;
}>();

// Use computed to ensure social links are reactive to store changes.
const socialLinks = computed(() => props.event?.socialLinks ?? []);
</script>
