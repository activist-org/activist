<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardConnect pageType="event" :socialLinks="socialLinks" />
</template>

<script setup lang="ts">
import { useGetEvent } from "~/composables/queries/useGetEvent";

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : "";

const { data: event } = useGetEvent(eventId);

// Use computed to ensure social links are reactive to store changes.
const socialLinks = computed(() => event.value?.socialLinks ?? []);
</script>
