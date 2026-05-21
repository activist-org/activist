<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardConnect
    :entity="organization"
    pageType="organization"
    :socialLinks="socialLinks"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  organization: Organization | null;
}>();

// Use computed to ensure social links are reactive to store changes.
const socialLinks = computed(() => props.organization?.socialLinks ?? []);
</script>
