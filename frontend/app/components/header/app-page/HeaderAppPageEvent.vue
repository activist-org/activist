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
import { useGetEvent } from "~/composables/queries/useGetEvent";

const props = defineProps<{
  header?: string;
  tagline?: string;
  underDevelopment?: boolean;
}>();

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : "";

const { data: event } = useGetEvent(eventId);

const headerName = computed<string>(() => {
  if (props.header) {
    return props.header;
  } else if (event) {
    return event.value?.name ?? "";
  } else {
    return "";
  }
});

const headerTagline = computed(() => {
  if (props.tagline) {
    return props.tagline;
  } else if (event.value) {
    return event.value?.tagline ?? "";
  } else {
    return "";
  }
});
</script>
