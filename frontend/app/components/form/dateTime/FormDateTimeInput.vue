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
        <FormTextInput
          id="start"
          v-on="inputEvents.start"
          :aria-labelledby="
            ariaLabelledby ? `${ariaLabelledby} start` : undefined
          "
          :value="inputValue.start"
        />
        <Icon class="mx-2" :name="IconMap.ARROW_RIGHT" size="1.5em" />
        <FormTextInput
          id="end"
          v-on="inputEvents.end"
          :aria-labelledby="
            ariaLabelledby ? `${ariaLabelledby} end` : undefined
          "
          :value="inputValue.end"
        />
      </div>
    </template>
  </DatePicker>
</template>

<script setup lang="ts">
import { DatePicker } from "v-calendar";
import { ref } from "vue";

defineOptions({
  inheritAttrs: false,
});
defineProps<{
  ariaLabelledby?: string;
}>();
const colorMode = useColorMode();
const colorModePreference = colorMode.preference == "light" ? "light" : "dark";
const range = ref({
  start: new Date(2020, 9, 12),
  end: new Date(2020, 9, 16),
});
</script>
