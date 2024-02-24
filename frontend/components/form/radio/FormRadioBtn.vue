<template>
  <div
    class="relative flex items-center w-full font-bold border h-9 first:rounded-l-md last:rounded-r-md border-light-interactive dark:border-dark-interactive"
    :class="{
      'bg-light-menu-selection dark:bg-dark-menu-selection text-light-distinct dark:text-dark-distinct':
        modelValue === value && !customColor,
      [customColorClass]: modelValue === value && customColor,
      'bg-light-header text-light-distinct-text dark:text-dark-distinct-text dark:bg-dark-header':
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
      class="flex items-center justify-center w-full h-full cursor-pointer select-none"
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
