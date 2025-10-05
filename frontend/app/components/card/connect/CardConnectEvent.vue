<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardConnect :socialLinks="socialLinks" pageType="event" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(eventId);

const { event } = storeToRefs(eventStore);

// Use computed to ensure social links are reactive to store changes
const socialLinks = computed(() => event.value.socialLinks);
</script>
