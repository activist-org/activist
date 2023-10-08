<template>
  <div
    class="flex flex-wrap w-full"
    :class="{ 'flex-col': checkboxComponent === 'FormCheckbox' }"
  >
    <component
      v-for="option in options"
      :class="{ 'flex-1': checkboxComponent !== 'FormCheckbox' }"
      :key="option.value"
      :is="checkboxComponent"
      :label="option.label"
      :modelValue="isSelected(option.value)"
      :value="option.value"
      @update:modelValue="toggleCheckbox(option.value)"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";

import useFormCheckboxRadio from "../../composables/useFormCheckboxRadio";

/**
 * The available checkbox type option.
 */
export type CheckboxOption = {
  /**
   * The checkbox label.
   */
  label: string;

  /**
   * The checkbox value.
   */
  value: string;
};

const props = defineProps({
  modelValue: {
    type: [string, Array] as PropType<string | string[]>,
    required: true,
  },
  options: {
    type: Array as PropType<CheckboxOption[]>,
    required: true,
  },
  name: {
    type: string,
    required: true,
  },
  style: {
    type: string,
    default: "button",
  },
  searchInput: {
    type: boolean,
    default: false,
  },
});

const checkboxComponent = computed(() => {
  return props.style === "button" ? "FormCheckboxButton" : "FormCheckbox";
});

const emit = defineEmits(["update:modelValue"]);

const { isSelected, toggleCheckbox } = useFormCheckboxRadio(
  props.modelValue,
  emit
);
</script>
