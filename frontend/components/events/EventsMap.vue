<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <MediaMapEvents :events="events" />
</template>

<script setup lang="ts">
import type { Event } from "~/types/events/event";

defineProps<{
  events: Event[];
}>();
</script>
