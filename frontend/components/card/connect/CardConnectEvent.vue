<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardConnect :socialLinks="event.socialLinks" pageType="event" />
</template>

<script setup lang="ts">
const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(eventId);

const { event } = eventStore;
</script>
