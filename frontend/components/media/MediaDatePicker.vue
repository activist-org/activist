<template>
  <form v-if="$colorMode.preference == 'light'" class="w-full h-full light-cal">
    <DatePicker
      v-model.range="dateData.range"
      :first-day-of-week="2"
      color="light-cta-orange"
      trim-weeks
      expanded
    />
  </form>
  <form v-else class="w-full h-full dark-cal">
    <DatePicker
      v-model.range="dateData.range"
      :first-day-of-week="2"
      color="dark-cta-orange"
      is-dark
      trim-weeks
      expanded
    />
  </form>
</template>

<script setup>
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";

const dateData = ref({
  range: {
    start: new Date(),
    end: new Date(),
  },
});
</script>

<style>
.vc-light-cta-orange {
  --vc-accent-50: #fae1c6;
  --vc-accent-100: #f9d7b3;
  --vc-accent-200: #f8cda0;
  --vc-accent-300: #f7c48d;
  --vc-accent-400: #f6ba79;
  --vc-accent-500: #f4b067;
  --vc-accent-600: #f2a654;
  --vc-accent-700: #f19c41;
  --vc-accent-800: #ef922e;
  --vc-accent-900: #ee881b;
}

.vc-pane-container {
  border-radius: 0.45em;
  background: #f0f0eb;
  color: #000000;
}
</style>
