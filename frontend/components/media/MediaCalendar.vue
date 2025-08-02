<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <form class="elem-shadow-sm h-full w-full rounded-[0.45em]">
    <Calendar
      :first-day-of-week="2"
      :color="colorModePreference"
      trim-weeks
      expanded
      :attributes="calendar"
    >
      <template #day-popover="{ dayTitle, attributes }">
        <ul class="flex flex-col space-y-1">
          <li v-for="{ key, customData } in attributes" :key="key">
            <slot v-bind="{ dayTitle, customData }" />
          </li>
        </ul>
      </template>
    </Calendar>
  </form>
</template>

<script setup lang="ts">
import { Calendar } from "v-calendar";
import "v-calendar/style.css";
type CalendarProps = InstanceType<typeof Calendar>["$props"];
type InferredAttributes = CalendarProps extends { attributes?: infer A }
  ? A
  : never;
type CalendarAttribute = InferredAttributes extends Array<infer U> ? U : never;

interface Props {
  calendarArgs: CalendarAttribute[];
}
const props = defineProps<Props>();

const calendar = ref<CalendarAttribute[]>(props.calendarArgs || []);
watch(
  () => props.calendarArgs,
  (newArgs) => {
    calendar.value = newArgs;
  },
  { immediate: true }
);
const colorMode = useColorMode();
const colorModePreference = colorMode.preference == "light" ? "light" : "dark";
</script>

<style>
.vc-light {
  --vc-border: transparent;
  --vc-hover-bg: rgba(140, 140, 140, 0.2);
  --vc-focus-ring: 0 0 0 2px rgba(242, 166, 84, 1);
  --vc-accent-50: #8f8f8f;
  --vc-accent-100: #858585;
  --vc-accent-200: #7a7a7a;
  --vc-accent-300: #707070;
  --vc-accent-400: #666666;
  --vc-accent-500: #5c5c5c;
  --vc-accent-600: #525252;
  --vc-accent-700: #474747;
  --vc-accent-800: #3d3d3d;
  --vc-accent-900: #323232;
}

.vc-light .vc-pane-container {
  border-radius: 0.45em;
  background: #f6f8fa;
  color: #000000;
}

.vc-dark {
  --vc-border: transparent;
  --vc-hover-bg: rgba(70, 70, 70, 0.25);
  --vc-focus-ring: 0 0 0 2px rgba(241, 156, 65, 1);
  --vc-accent-50: #8f8f8f;
  --vc-accent-100: #858585;
  --vc-accent-200: #7a7a7a;
  --vc-accent-300: #707070;
  --vc-accent-400: #999999;
  --vc-accent-500: #8f8f8f;
  --vc-accent-600: #858585;
  --vc-accent-700: #7a7a7a;
  --vc-accent-800: #707070;
  --vc-accent-900: #666666;
}

.vc-dark .vc-pane-container {
  border-radius: 0.45em;
  background: #131316;
  color: #ffffff;
}
</style>
