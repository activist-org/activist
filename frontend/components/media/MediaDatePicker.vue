<template>
  <form
    v-if="$colorMode.preference == 'light'"
    class="w-full h-full rounded-[0.45em] shadow-sm shadow-zinc-700"
  >
    <DatePicker
      v-model="date"
      :first-day-of-week="2"
      color="light-mode"
      trim-weeks
      expanded
    />
  </form>
  <form v-else class="w-full h-full rounded-[0.45em] shadow-sm shadow-zinc-700">
    <DatePicker
      v-model="date"
      :first-day-of-week="2"
      color="dark-mode"
      :is-dark="true"
      trim-weeks
      expanded
    />
  </form>
</template>

<script setup>
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";

const date = ref(new Date());
</script>

<style>
.vc-light-mode {
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

.vc-light-mode .vc-pane-container {
  border-radius: 0.45em;
  background: #f6f8fa;
  color: #000000;
}

.vc-dark-mode {
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

.vc-dark-mode .vc-pane-container {
  border-radius: 0.45em;
  background: #131316;
  color: #ffffff;
}
</style>
