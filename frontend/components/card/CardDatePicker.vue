<template>
    <form
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
    <form v-else>
      <h1>Testezinhoo</h1>
      <DatePicker
        v-model.range="range"
        :first-day-of-week="2"
        color="dark-mode"
        :is-dark="true"
        trim-weeks
        expanded
        mode="dateTime"
        hide-time-header
      />
    </form>
  </template>
  
  <script setup>
  import { DatePicker } from "v-calendar";
  import "v-calendar/style.css";
  import{Calendar} from "v-calendar";

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
  