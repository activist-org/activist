<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="space-y-6 pb-6 pt-3 md:pt-4">
    <MediaMapEvents
      v-if="events.length"
      class="h-[calc(50vh-1rem)] w-full"
      :events="events"
    />
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/events/event";

defineProps<{
  events: Event[];
}>();
</script>
