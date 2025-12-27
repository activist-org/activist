<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="relative flex h-9 w-full items-center border border-interactive font-bold first:rounded-l-md last:rounded-r-md py-7 px-2"
    :class="{
      'style-menu-option-cta': optionIsChecked(value) && !customColor,
      [customColorClass]: optionIsChecked(value) && customColor,
      'style-menu-option bg-layer-2': !optionIsChecked(value),
    }"
  >
    <input
      :id="uuid"
      v-bind="$attrs"
      @change="emit('update:modelValue', value)"
      :checked="optionIsChecked(value)"
      class="hidden"
      type="radio"
      :value="value"
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

export interface Props {
  label?: string;
  value?: unknown;
  modelValue?: unknown;
  error?: string;
  customColor?: string;
  compareBy?: string;
}

const optionIsChecked = (optionValue: unknown): boolean => {
  if (props.compareBy && props.modelValue && optionValue) {
    return (
      (props.modelValue as Record<string, unknown>)[props.compareBy] ===
      (optionValue as Record<string, unknown>)[props.compareBy]
    );
  }
  return props.modelValue === optionValue;
};

const props = withDefaults(defineProps<Props>(), {
  label: "",
  error: "",
  customColor: "",
  compareBy: "id",
});
const emit = defineEmits(["update:modelValue"]);

const uuid = uuidv4();
const customColorClass =
  props.customColor !== ""
    ? `bg-${props.customColor}/60 dark:bg-${props.customColor}/10 dark:text-${props.customColor}`
    : "";
</script>
