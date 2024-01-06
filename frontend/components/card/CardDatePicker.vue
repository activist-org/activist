<template>
  <form class="flex flex-col w-full px-5 py-4 space-y-3 card-style">
    <h1 class="text-2xl">
      <strong>{{ $t("components.card-date-picker.date") }} *</strong>
    </h1>
    <div class="flex grow">
      <div class="flex flex-row space-x-2 w-[50%]">
        <FormCheckbox />
        <label for="All Day">{{
          $t("components.card-date-picker.all-day")
        }}</label>
      </div>
      <div class="flex flex-row space-x-2 w-[50%] pl-1">
        <FormCheckbox />
        <label for="Multiple Days">{{
          $t("components.card-date-picker.multiple-days")
        }}</label>
      </div>
    </div>
    <div class="flex flex-row space-x-2">
      <DatePicker
        v-model="date1"
        mode="Time"
        is24hr
        hide-time-header
        :color="cMode"
        class="date-picker-width elem-shadow-sm bg-light-header dark:bg-dark-header"
      />
      <DatePicker
        v-model="date2"
        mode="Time"
        is24hr
        hide-time-header
        :color="cMode"
        class="date-picker-width elem-shadow-sm bg-light-header dark:bg-dark-header"
      />
    </div>
    <DatePicker
      v-model="dateArray"
      :first-day-of-week="2"
      trim-weeks
      expanded
      :color="cMode"
      :attributes="attributes"
      transparent
    ></DatePicker>
  </form>
</template>

<script setup lang="ts">
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";

const date1 = "2021-02-28T18:20:00.000Z";
const date2 = "2021-02-28T18:20:00.000Z";

const colorMode = useColorMode();
const cMode = colorMode.preference == "light" ? "light" : "dark";

const attributes = ref([
  {
    highlight: {
      color: "orange",
    },
  },
]);
</script>

<style>
.vc-light {
  /* Base. */
  --vc-border: transparent;
  --vc-hover-bg: rgba(140, 140, 140, 0.2);
  --vc-focus-ring: 0 0 0 2px rgba(242, 166, 84, 1);
  --vc-day-content-hover-bg: rgba(242, 166, 84, 1);
  --vc-accent-600: #d76226;

  /* Time select group. */
  --vc-time-select-group-bg: transparent;
  --vc-time-select-group-border: transparent;
  --vc-time-select-group-icon-color: rgba(0, 0, 0, 0.85);
}
.vc-dark {
  /* Base. */
  --vc-border: transparent;
  --vc-hover-bg: rgba(70, 70, 70, 0.25);
  --vc-focus-ring: 0 0 0 2px rgba(241, 156, 65, 1);
  --vc-day-content-hover-bg: rgba(242, 166, 84, 1);
  --vc-accent-600: #d76226;

  /* Time select group. */
  --vc-time-select-group-bg: transparent;
  --vc-time-select-group-border: transparent;
  --vc-time-select-group-icon-color: rgba(43, 50, 59, 1);
  --vc-day-content-hover-bg: rgba(242, 166, 84, 1);
}

.date-picker-width {
  width: 100%;
}
</style>
