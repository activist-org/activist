<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="space-y-6 pb-6 pt-3 md:pt-4">
    <MediaCalendar
      class="h-[calc(50vh-1rem)] w-full"
      :calendar-args="calendar"
    />
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/events/event";

import { colorByType, getAllDaysInRange } from "~/utils/utils";
const props = defineProps<{
  events: Event[];
}>();
const actionEvents = props.events.filter((event) => {
  return event.type === "action";
});
const learnEvents = props.events.filter((event) => {
  return event.type === "learn";
});
const learnEventsDates = learnEvents.flatMap((event) => {
  return getAllDaysInRange({
    start: new Date(event.startTime),
    end: new Date(event.endTime),
  });
});
const actionEventsDates = actionEvents.flatMap((event) => {
  return getAllDaysInRange({
    start: new Date(event.startTime),
    end: new Date(event.endTime),
  });
});
const learnEventsRange = learnEvents.map((event) => {
  return {
    start: new Date(event.startTime),
    end: new Date(event.endTime),
  };
});
const actionEventsRange = actionEvents.map((event) => {
  return {
    start: new Date(event.startTime),
    end: new Date(event.endTime),
  };
});
const calendar = [
  {
    dot: {
      color: colorByType["action"],
      dates: actionEventsDates,
    },
  },
  {
    dot: {
      color: colorByType["learn"],
      dates: learnEventsDates,
    },
  },
  {
    highlight: {
      start: { fillMode: "solid", color: colorByType["action"] },
      end: { fillMode: "solid", color: colorByType["action"] },
      base: { fillMode: "solid", color: colorByType["action"] },
      dates: actionEventsRange,
    },
  },
  {
    highlight: {
      start: { fillMode: "solid", color: colorByType["learn"] },
      end: { fillMode: "solid", color: colorByType["learn"] },
      base: { fillMode: "solid", color: colorByType["learn"] },
      dates: learnEventsRange,
    },
  },
];
console.log(calendar);
// const eventDates = props.events.map((event) => {
//   return {
//     start: event.startTime,
//     end: event.endTime,
//     title: event.name,
//     description: event.texts.description,
//     location: event.offlineLocation?.displayName,
//     id: event.id,
//   };
// });
</script>
