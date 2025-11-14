<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div v-for="event in events" class="space-y-6 pb-6 pt-3 md:pt-4">
    <CardSearchResultEntityEvent :event="event" :isPrivate="false" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  events: Activity[];
}>();
</script>
