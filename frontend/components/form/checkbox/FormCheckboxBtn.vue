<template>
  <div
    class="relative flex items-center h-9 font-bold border border-r-0 border-light-interactive dark:border-dark-interactive last:border-r first:rounded-l-md last:rounded-r-md"
    :class="{
      'bg-light-menu-selection dark:bg-dark-menu-selection text-light-distinct dark:text-dark-distinct':
        modelValue && !customColor,
      [customColorClass]: modelValue && customColor,
      'bg-light-header text-light-special-text dark:text-dark-special-text dark:bg-dark-header':
        !modelValue,
    }"
  >
    <input
      class="hidden"
      type="checkbox"
      v-bind="{ ...$attrs, onChange: updateValue }"
      :checked="modelValue"
      :id="uuid"
    />
    <label
      v-if="label"
      class="w-full h-full flex items-center justify-center cursor-pointer select-none"
      :for="uuid"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import useFormInput from "../../../composables/useFormSetup";
const { v4: uuidV4 } = require("uuid");

export interface Props {
  label?: string;
  modelValue?: boolean;
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
const uuid = uuidV4();
const customColorClass =
  props.customColor !== ""
    ? `bg-light-${props.customColor}/60 dark:bg-dark-${props.customColor}/10 dark:text-dark-${props.customColor}`
    : "";
</script>
