<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <DatePicker
    v-model="range"
    :color="colorModePreference"
    is-range
    v-bind="$attrs"
  >
    <template #default="{ inputValue, inputEvents }">
      <div class="flex items-center justify-center">
        <FormTextInput v-on="inputEvents.start" :value="inputValue.start" />
        <Icon class="mx-2" :name="IconMap.ARROW_RIGHT" size="1.5em" />
        <FormTextInput v-on="inputEvents.end" :value="inputValue.end" />
      </div>
    </template>
  </DatePicker>
</template>

<script setup>
import { DatePicker } from "v-calendar";
import { ref } from "vue";
const colorMode = useColorMode();
const colorModePreference = colorMode.preference == "light" ? "light" : "dark";
const range = ref({
  start: new Date(2020, 9, 12),
  end: new Date(2020, 9, 16),
});
</script>
