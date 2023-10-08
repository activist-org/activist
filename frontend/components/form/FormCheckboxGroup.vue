<template>
  <div
    class="flex flex-wrap w-full"
    :class="{ 'flex-col': checkboxComponent === 'formcheckbox' }"
  >
    <component
      v-for="option in options"
      :class="{ 'flex-1': checkboxComponent !== 'formcheckbox' }"
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
import { proptype } from "vue";

import useFormCheckboxRadio from "../../composables/useFormCheckboxRadio";

/**
 * the available checkbox type option.
 */
export type checkboxoption = {
  /**
   * the checkbox label.
   */
  label: string;

  /**
   * the checkbox value.
   */
  value: string;
};

const props = defineProps({
  modelValue: {
    type: [string, array] as proptype<string | string[]>,
    required: true,
  },
  options: {
    type: array as proptype<checkboxoption[]>,
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
  return props.style === "button" ? "formcheckboxbutton" : "formcheckbox";
});

const emit = defineEmits(["update:modelValue"]);

const { isSelected, toggleCheckbox } = useFormCheckboxRadio(
  props.modelValue,
  emit
);
</script>
