<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    :class="{
      'space-y-6 pb-6 pt-3 md:pt-4': type === 'list',
      'grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3': type === 'grid',
    }"
  >
    <CardSearchResultEntityEvent
      v-for="event in events ?? []"
      :key="event.id"
      :event="event"
      :isPrivate="false"
      :type="cardType"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  events?: CommunityEvent[];
  type?: "grid" | "list";
}>();
const cardType = computed(() =>
  props.type === "list" ? "detailed" : "compact"
);
</script>
