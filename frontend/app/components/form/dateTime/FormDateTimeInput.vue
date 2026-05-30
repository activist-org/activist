<template>
  <DatePicker v-model="range" is-range>
    <template #default="{ inputValue, inputEvents }">
      <div class="flex justify-center items-center">
        <FormTextInput :value="inputValue.start" v-on="inputEvents.start" />
        <Icon :name="IconMap.ARROW_RIGHT" size="1.5em" class="mx-2" />
        <FormTextInput :value="inputValue.end" v-on="inputEvents.end" />
      </div>
    </template>
  </DatePicker>
</template>

<script setup>
import { DatePicker } from "v-calendar";

import { ref } from 'vue';

const range = ref({
  start: new Date(2020, 9, 12),
  end: new Date(2020, 9, 16),
});
</script>
