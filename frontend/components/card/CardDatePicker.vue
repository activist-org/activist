<template>
    <form class="flex flex-col w-full space-y-3 px-5 py-4 card-style"
      v-if="$colorMode.preference == 'light'"
      
    >
      <DatePicker
        v-model.range="range"
        :first-day-of-week="2"
        color="light-mode"
        trim-weeks
        expanded
        mode="dateTime"
        hide-time-header
      />
    </form>
    
    <form v-else class="flex flex-col w-full space-y-3 px-5 py-4 card-style">
      <h1 class="text-2xl" ><strong>Date *</strong></h1>

      <div class="flex justify-between">
        <div class="flex flex-row space-x-2">
          <input type="checkbox" id="All Day" value="All Day" />
          <label for="All Day">All Day</label>
        </div> 

        <div class="flex flex-row space-x-2 ml-4">
          <input type="checkbox" id="Multiple Days" value="Multiple Days" />
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
        :first-day-of-week="2"
        v-model="dateArray"
        trim-weeks
        expanded
        @click="addDate"
        :attributes="attributes"
        transparent
        borderless
        ></DatePicker>

      <!-- <DatePicker
        :first-day-of-week="2"
        :is-dark="true"
        trim-weeks
        expanded
        mode='multiple'
        v-model='myDates'   
      /> -->
    </form>
  </template>
  
  <script setup>
  import { DatePicker } from "v-calendar";
  import "v-calendar/style.css";
  import{ Calendar } from "v-calendar";
  const date1 = "2021-02-28T18:20:00.000Z"
  const date2 = "2021-02-28T18:20:00.000Z"
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  const attributes = ref([
  {
    key: "today",
    dot: "orange",
    dates: new Date(),
  },
  {
    highlight: {
      color: "orange",
      fillMode: "light",
    },
    dates: [
      //Put the dates that should be highlighted here.
      new Date(year, month, 13),
      new Date(year, month, 14),
    ],
  },
]);
  function addDate() {
    const novaData = new Date();
    dateArray.value.push(novaData);
}

//     function onDayClick(day) {
//       const idx = this.days.findIndex(d => d.id === day.id);
//       if (idx >= 0) {
//         this.days.splice(idx, 1);
//       } else {
//         this.days.push({
//           id: day.id,
//           date: day.date,
//         });
//       }
//     }

  </script>
  
  <style>
  .vc-light {
  /* Base */
  --vc-color: var(--vc-gray-900);
  --vc-bg: var(--vc-white);
  --vc-border: var(--vc-gray-300);
  --vc-hover-bg: hsla(211, 25%, 84%, 0.3);
  --vc-focus-ring: 0 0 0 2px rgb(59, 131, 246, 0.4);
  /* Calendar header */
  --vc-header-arrow-color: var(--vc-gray-500);
  --vc-header-arrow-hover-bg: var(--vc-gray-200);
  --vc-header-title-color: var(--vc-gray-900);
  /* Calendar weekdays */
  --vc-weekday-color: var(--vc-gray-500);
  /* Calendar weeknumbers */
  --vc-weeknumber-color: var(--vc-gray-400);
  /* Calendar nav */
  --vc-nav-hover-bg: var(--vc-gray-200);
  --vc-nav-title-color: var(--vc-gray-900);
  --vc-nav-item-hover-box-shadow: none;
  --vc-nav-item-active-color: var(--vc-white);
  --vc-nav-item-active-bg: var(--vc-accent-500);
  --vc-nav-item-active-box-shadow: var(--vc-shadow);
  --vc-nav-item-current-color: var(--vc-accent-600);
  /* Calendar day popover */
  --vc-day-popover-container-color: var(--vc-white);
  --vc-day-popover-container-bg: var(--vc-gray-800);
  --vc-day-popover-container-border: var(--vc-gray-700);
  --vc-day-popover-header-color: var(--vc-gray-700);
  /* Popover content */
  --vc-popover-content-color: var(--vc-gray-900);
  --vc-popover-content-bg: var(--vc-gray-50);
  --vc-popover-content-border: var(--vc-gray-300);
  /* Time picker */
  --vc-time-picker-border: var(--vc-gray-300);
  --vc-time-weekday-color: var(--vc-gray-700);
  --vc-time-month-color: var(--vc-accent-600);
  --vc-time-day-color: var(--vc-accent-600);
  --vc-time-year-color: var(--vc-gray-500);
  /* Time select group */
  --vc-time-select-group-bg:transparent;
  --vc-time-select-group-border: transparent;
  --vc-time-select-group-icon-color: transparent;
  /* Base select */
  --vc-select-color: var(--vc-gray-900);
  --vc-select-bg: var(--vc-gray-100);
  --vc-select-hover-bg: var(--vc-gray-200);
  /* Calendar day */
  --vc-day-content-hover-bg: var(--vc-hover-bg);
  --vc-day-content-disabled-color: var(--vc-gray-400);
}
  .vc-dark {
  /* Base */
  --vc-color: var(--vc-white);
  --vc-bg: hsla(135, 84%, 34%, 0.3);
  --vc-border: var(--vc-gray-700);
  --vc-hover-bg: hsla(135, 84%, 34%, 0.3);
  --vc-focus-ring: 0 0 0 2px rgba(246, 59, 115, 0.7);
  /* Calendar header */
  --vc-header-arrow-color: hsla(60, 14%, 93%, 1);
  --vc-header-arrow-hover-bg: hsla(60, 14%, 93%, 1);
  --vc-header-title-color: hsla(60, 14%, 93%, 1);
  /* Calendar weekdays */
  --vc-weekday-color: var(--vc-accent-200);
  /* Calendar weeknumbers */
  --vc-weeknumber-color: var(--vc-gray-500);
  /* Calendar nav */
  --vc-nav-hover-bg: var(--vc-gray-700);
  --vc-nav-title-color: var(--vc-gray-100);
  --vc-nav-item-hover-box-shadow: none;
  --vc-nav-item-active-color: var(--vc-white);
  --vc-nav-item-active-bg: var(--vc-accent-500);
  --vc-nav-item-active-box-shadow: none;
  --vc-nav-item-current-color: var(--vc-accent-400);
  /* Calendar day popover */
  --vc-day-popover-container-color: var(--vc-gray-800);
  --vc-day-popover-container-bg: var(--vc-white);
  --vc-day-popover-container-border: var(--vc-gray-100);
  --vc-day-popover-header-color: var(--vc-gray-300);
  /* Popover content */
  --vc-popover-content-color: var(--vc-white);
  --vc-popover-content-bg: var(--vc-gray-800);
  --vc-popover-content-border: var(--vc-gray-700);
  /* Time picker */
  --vc-time-picker-border: var(--vc-gray-700);
  --vc-time-weekday-color: var(--vc-gray-400);
  --vc-time-month-color: var(--vc-accent-400);
  --vc-time-day-color: var(--vc-accent-400);
  --vc-time-year-color: var(--vc-gray-500);
  /* Time select group */
  --vc-time-select-group-bg: var(--vc-gray-700);
  --vc-time-select-group-border: var(--vc-gray-500);
  --vc-time-select-group-icon-color: var(--vc-accent-400);
  /* Base select */
  --vc-select-color: var(--vc-gray-200);
  --vc-select-bg: var(--vc-gray-700);
  --vc-select-hover-bg: var(--vc-gray-600);
  /* Calendar day */
  --vc-day-content-hover-bg: var(--vc-hover-bg);
  --vc-day-content-disabled-color: var(--vc-gray-600);
  /* Calendar attributes */
}
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
  .vc-is-dark {
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
  .gray-mode {
    background-color: #f0f0f0;
    color: #333333; /* Cor do texto */
  }
  .date-picker-container {
    display: inline-block; /* Permite que os containers se alinhem horizontalmente */
    margin-right: 200px; /* ou a quantidade de espaçamento que você deseja */
   }
  .date-picker {
    width: 100%; 
    background-color:rgba(240, 240, 235, 1);
;
  }

  .custom-gray-datepicker .vdp-content {
    background-color: #8f8f8f; 
  }

  .custom-gray-datepicker .vdp-header {
    background-color: #721717; 
  }
  </style>
  