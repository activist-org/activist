<template>
  <CardSearchResult
    :event="event"
    :isReduced="isReduced"
    :isPrivate="isPrivate"
  />
</template>

<script setup lang="ts">
import type { Event } from "~/types/events/event";

defineProps<{
  event: Event;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();
</script>
