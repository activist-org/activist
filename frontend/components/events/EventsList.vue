<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div v-for="event in events" class="space-y-6 pb-6 pt-3 md:pt-4">
    <CardSearchResultEvent :isPrivate="false" :event="event" />
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/events/event";

defineProps<{
  events: Event[];
}>();
</script>
