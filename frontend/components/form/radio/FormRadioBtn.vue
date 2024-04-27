<template>
  <div
    class="relative flex h-9 w-full items-center border border-light-interactive font-bold first:rounded-l-md last:rounded-r-md dark:border-dark-interactive"
    :class="{
      'bg-light-menu-selection text-light-layer-1 dark:bg-dark-menu-selection dark:text-dark-layer-1':
        modelValue === value && !customColor,
      [customColorClass]: modelValue === value && customColor,
      'bg-light-layer-2 text-light-distinct-text dark:bg-dark-layer-2 dark:text-dark-distinct-text':
        modelValue !== value,
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
    ? `bg-light-${props.customColor}/60 dark:bg-dark-${props.customColor}/10 dark:text-dark-${props.customColor}`
    : "";
</script>
