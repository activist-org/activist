<template>
    <form v-if="$colorMode.preference == 'light'" class="flex flex-col w-full space-y-3 px-5 py-4 card-style"
      
      
    >
    <h1 class="text-2xl" ><strong>Date *</strong></h1>

<div class="flex justify-between">
  <div class="flex flex-row space-x-2">
    <input id="All Day" type="checkbox"  value="All Day" />
    <label for="All Day">All Day</label>
  </div> 

  <div class="flex flex-row space-x-2 margin-left-20">
    <input id="Multiple Days" type="checkbox"  value="Multiple Days" />
    <label for="Multiple Days">Multiple Days</label>
  </div>
</div>

<div class="flex flex-row">
  <DatePicker
    v-model="date1" mode="Time" is24hr hide-time-header
    class="date-picker custom-gray-datepicker"
    borderless
    />
  <DatePicker
    v-model="date2" mode="Time" is24hr hide-time-header
    class="date-picker custom-gray-datepicker"
    borderless
    />
</div>

<DatePicker
  v-model="dateArray"  
  :first-day-of-week="2"
  trim-weeks
  expanded
  :attributes="attributes"
  transparent
  borderless
  ></DatePicker>
    </form>
    
    <form v-else class="flex flex-col w-full space-y-3 px-5 py-4 card-style">
      <h1 class="text-2xl" ><strong>Date *</strong></h1>

      <div class="flex-container">
        <div class="flex flex-row space-x-2">
          <input id="All Day" type="checkbox"  value="All Day" />
          <label for="All Day">All Day</label>
        </div> 

        <div class="flex flex-row space-x-2 ml-right">
          <input id="Multiple Days" type="checkbox"  value="Multiple Days" />
          <label for="Multiple Days">Multiple Days</label>
        </div>
      </div>

      <div class="flex flex-row">
        <DatePicker
          v-model="date1" mode="Time" is24hr hide-time-header
          class="date-picker custom-gray-datepicker"
          borderless
          />
        <DatePicker
          v-model="date2" mode="Time" is24hr hide-time-header
          class="date-picker custom-gray-datepicker"
          borderless
          />
      </div>

      <DatePicker
        v-model="dateArray"
        :first-day-of-week="2"
        trim-weeks
        expanded
        :attributes="attributes"
        transparent
        borderless
        ></DatePicker>
    </form>
  </template>
  
  <script setup>
  import { DatePicker } from "v-calendar";
  import "v-calendar/style.css";
  
  const date1 = "2021-02-28T18:20:00.000Z"
  const date2 = "2021-02-28T18:20:00.000Z"

  const attributes = ref([

  {
    highlight: {
      color: "orange",
      fillMode: "light",
    },
  },
]);
  </script>
  
  <style>
  .vc-light {
    /* Base */
    --vc-color: var(--vc-gray-900);
    --vc-bg: var(--vc-white);
    --vc-border: var(--vc-gray-300);
    --vc-hover-bg: hsla(211, 25%, 84%, 0.3);
    --vc-focus-ring: 0 0 0 2px rgba(212, 124, 23, 0.4);
    /* Time select group */
    --vc-time-select-group-bg:transparent;
    --vc-time-select-group-border: transparent;
    --vc-time-select-group-icon-color: transparent;
  }
  .vc-dark {
    /* Base */
    --vc-color: var(--vc-gray-900);
    --vc-bg: var(--vc-white);
    --vc-border: var(--vc-gray-300);
    --vc-hover-bg: hsla(211, 25%, 84%, 0.3);
    --vc-focus-ring: 0 0 0 2px rgba(212, 124, 23, 0.4);
    /* Time select group */
    --vc-time-select-group-bg:transparent;
    --vc-time-select-group-border: transparent;
    --vc-time-select-group-icon-color: transparent;
  }
  .date-picker {
    width: 100%; 
    background-color:rgba(240, 240, 235, 1);
  }
  .flex-container {
    display: flex;
    justify-content: space-between;
  }

  .flex-container > div {
    flex-grow: 2;
  }
  .ml-right {
    margin-left: 50px;
  }
  </style>
  