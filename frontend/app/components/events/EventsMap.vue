<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="space-y-6 pb-6 pt-3 md:pt-4">
    <div
      v-if="isOnline"
      class="grid gap-4 md:grid-cols-2"
      data-testid="events-online-list"
    >
      <CardOnlineEventLink
        v-for="event in onlineEvents"
        :key="event.id"
        :event="event"
      />
    </div>
    <MediaMapEvents
      v-else-if="events.length"
      class="h-[calc(50vh-1rem)] w-full"
      :events="events"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  events: CommunityEvent[];
  isOnline?: boolean;
}>();

const onlineEvents = computed(() =>
  props.events.filter((event) => event.setting === "online")
);

const isOnline = computed(() => props.isOnline === true);
</script>
