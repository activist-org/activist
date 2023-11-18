<template>
  <form
    v-if="$colorMode.preference == 'light'"
    class="w-full h-full rounded-[0.45em] shadow-sm shadow-zinc-700"
  >
    <!-- <DatePicker
      v-model="date"
      :first-day-of-week="2"
      color="light-mode"
      trim-weeks
      expanded
    /> -->
    <VCalendar :attributes='attrs' />
    <!-- <VDatePicker v-model="date" /> -->

  </form>
  <form v-else class="w-full h-full rounded-[0.45em] shadow-sm shadow-zinc-700">
    <VCalendar :attributes='attrs' />
    <!-- <VDatePicker
      v-model="date"
      :first-day-of-week="2"
      color="dark-mode"
      :is-dark="true"
      trim-weeks
      expanded
      :select-attribute="attrs"
    /> -->
    <!-- <VCalendar :is-dark="isDark" /> -->
    <!-- <VDatePicker v-model="date" /> -->
  </form>
</template>

<script setup>
import { DatePicker } from "v-calendar";
import VCalendar from 'v-calendar';
import { ref } from 'vue';
import "v-calendar/style.css";
const attrs = ref([
{
        // An optional key can be used for retrieving this attribute later,
        // and will most likely be derived from your data object
        key: Any,
        // Attribute type definitions
        content: 'red',   // Boolean, String, Object
        highlight: true,  // Boolean, String, Object
        dot: true,        // Boolean, String, Object
        bar: true,        // Boolean, String, Object
        // Your custom data object for later access, if needed
        // We also need some dates to know where to display the attribute
        // We use a single date here, but it could also be an array of dates,
        //  a date range or a complex date pattern.
        dates: new Date(),
        // Think of `order` like `z-index`
        order: 0
      }
]);
const date = ref(new Date());
const markedDates = ref([new Date("2023-11-15"), new Date("2023-11-20")]); // Adicione as datas que deseja marcar aqui
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
