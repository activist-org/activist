<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex items-center gap-2">
    <MetaTagDate
      v-for="date in datesMapped"
      :key="date.label"
      :date="date.label"
    />

    <span
      v-if="props.dates.length > 2"
      v-tooltip="getDatesText()"
      class="link-text"
      >... show more dates</span>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  dates: EventTime[];
}>();
const datesMapped = computed(() => {
  if (!props.dates) return [];
  if (props.dates.length > 2) {
    return props.dates.slice(0, 2).map((date) => {
      return {
        label: date.allDay
          ? `${formatDate(new Date(date.startTime)) ?? ""} all day`
          : `${formatDate(new Date(date.startTime)) ?? ""} from ${new Date(date.startTime).toISOString().split("T")[1]?.slice(0, 5) ?? ""} - ${date.endTime ? (new Date(date.endTime).toISOString().split("T")[1]?.slice(0, 5) ?? "") : ""}`,
      };
    });
  }
  return props.dates.map((date) => {
    return {
      label: date.allDay
        ? `${formatDate(new Date(date.startTime)) ?? ""} all day`
        : `${formatDate(new Date(date.startTime)) ?? ""} from ${new Date(date.startTime).toISOString().split("T")[1]?.slice(0, 5) ?? ""} - ${date.endTime ? (new Date(date.endTime).toISOString().split("T")[1]?.slice(0, 5) ?? "") : ""}`,
    };
  });
});
const getDatesText = () => {
  return props.dates
    .map((date) => {
      return date.allDay
        ? `${formatDate(new Date(date.startTime)) ?? ""} all day`
        : `${formatDate(new Date(date.startTime)) ?? ""} from ${new Date(date.startTime).toISOString().split("T")[1]?.slice(0, 5) ?? ""} - ${date.endTime ? (new Date(date.endTime).toISOString().split("T")[1]?.slice(0, 5) ?? "") : ""}`;
    })
    .join('<br class="my-0.5" />');
};
</script>
