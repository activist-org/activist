<template>
  <form class="elem-shadow-sm h-full w-full rounded-[0.45em]">
    <Calendar
      :first-day-of-week="2"
      :color="colorModePreference"
      trim-weeks
      expanded
      :attributes="calendarArgs"
    >
      <template #day-popover="{ day, customData }">
        <slot v-bind="{ day, customData }" />
      </template>
    </Calendar>
  </form>
</template>

<script setup lang="ts">
import { Calendar } from "v-calendar";
import "v-calendar/style.css";
type CalendarAttribute<T = unknown> = {
  key?: string | number;
  dates: Date[] | { start: Date; end?: Date }[] | undefined;
  customData?: T;
  popover?: {
    label?: string;
    visibility?: "click" | "hover" | "hover-focus" | "focus";
  };
  dot?: {
    color?: string;
    class?: string;
    dates: Date[] | { start: Date; end?: Date }[] | undefined;
  };
  highlight?: {
    start?: { fillMode?: string; color?: string };
    end?: { fillMode?: string; color?: string };
    base?: { fillMode?: string; color?: string };
    class?: string;
    dates: Date[] | { start: Date; end?: Date }[] | undefined;
  };
  bar?: {
    color?: string;
    class?: string;
    dates: Date[] | { start: Date; end?: Date }[] | undefined;
  };
  order?: number;
  pinPage?: boolean;
};

interface Props {
  calendarArgs: CalendarAttribute[];
}
defineProps<Props>();

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
