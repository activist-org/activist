<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="space-y-6 pb-6 pt-3 md:pt-4">
    <MediaCalendar class="h-[calc(50vh-1rem)] w-full" :calendar-args="calendar">
      <template #default="{ customData }">
        <div class="bg-[#1e293b] hover:bg-[#334155]">
          <NuxtLink
            :to="localePath(`/events/${customData.id}`)"
            class="flex items-center space-x-1 px-2 py-1"
          >
            <span
              class="text-sm leading-none"
              :style="{
                color:
                  customData.type === 'learn'
                    ? colorByType.learn
                    : colorByType.action,
              }"
            >
              ●
            </span>
            <span>{{ customData.name }}</span>
          </NuxtLink>
        </div>
      </template>
    </MediaCalendar>
  </div>
</template>

<script setup lang="ts">
import type { PopoverVisibility } from "v-calendar/dist/types/src/utils/popovers.js";

import type { Event } from "~/types/events/event";

import { colorByType, getAllDaysInRange } from "~/utils/utils";

const props = defineProps<{
  events: Event[];
}>();
const localePath = useLocalePath();
const actionEvents = props.events.filter((event) => {
  return event.type === "action";
});
const learnEvents = props.events.filter((event) => {
  return event.type === "learn";
});
const learnEventsDates = learnEvents.map((event) => ({
  key: `${event.id}-learn`,
  customData: event,
  dot: {
    style: {
      backgroundColor: colorByType["learn"],
    },
  },
  dates: getAllDaysInRange({
    start: new Date(event.startTime),
    end: event.endTime ? new Date(event.endTime) : new Date(event.startTime),
  }),
  popover: {
    visibility: "hover-focus" as PopoverVisibility,
    hideIndicator: true,
    isInteractive: true,
  },
}));

const actionEventsDates = actionEvents.map((event) => ({
  key: `${event.id}-action`,
  customData: event,
  dot: {
    style: {
      backgroundColor: colorByType["action"],
    },
  },
  dates: getAllDaysInRange({
    start: new Date(event.startTime),
    end: event.endTime ? new Date(event.endTime) : new Date(event.startTime),
  }),
  popover: {
    visibility: "hover-focus" as PopoverVisibility,
    hideIndicator: true,
    isInteractive: true,
  },
}));
const calendar = [...actionEventsDates, ...learnEventsDates];
</script>
