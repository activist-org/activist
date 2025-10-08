<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="relative flex h-9 w-full items-center border border-interactive font-bold first:rounded-l-md last:rounded-r-md"
    :class="{
      'bg-menu-selection text-layer-1': modelValue === value && !customColor,
      [customColorClass]: modelValue === value && customColor,
      'bg-layer-2 text-distinct-text': modelValue !== value,
    }"
  >
    <input
      :id="uuid"
      class="hidden"
      type="radio"
      v-bind="{ ...$attrs, onChange: updateValue }"
      :checked="modelValue === value"
    />
    <label
      v-if="label"
      class="flex h-full w-full cursor-pointer select-none items-center justify-center"
      :for="uuid"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";

import useFormInput from "~/composables/useFormSetup";

export interface Props {
  label?: string;
  value?: string;
  modelValue?: string;
  error?: string;
  customColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  error: "",
  customColor: "",
});

const emit = defineEmits(["update:modelValue"]);
const { updateValue } = useFormInput(props, emit);
const uuid = uuidv4();
const customColorClass =
  props.customColor !== ""
    ? `bg-${props.customColor}/60 dark:bg-${props.customColor}/10 dark:text-${props.customColor}`
    : "";
</script>
