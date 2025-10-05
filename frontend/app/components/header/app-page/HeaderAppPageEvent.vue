<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <HeaderAppPage
    :header="headerName"
    :tagline="headerTagline"
    :underDevelopment="underDevelopment"
  >
    <slot />
  </HeaderAppPage>
</template>

<script setup lang="ts">
const props = defineProps<{
  header?: string;
  tagline?: string;
  underDevelopment?: boolean;
}>();

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(eventId);
const { event } = eventStore;

const headerName = computed<string>(() => {
  if (props.header) {
    return props.header;
  } else if (event) {
    return event.name;
  } else {
    return "";
  }
});

const headerTagline = computed(() => {
  if (props.tagline) {
    return props.tagline;
  } else if (event) {
    return event.tagline;
  } else {
    return "";
  }
});
</script>
