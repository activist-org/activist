<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="flex w-full flex-wrap"
    :class="{ 'flex-col': checkboxComponent === 'FormCheckbox' }"
  >
    <component
      v-for="option in options"
      @update:modelValue="toggleCheckbox(option.value)"
      :is="checkboxComponent"
      :key="option.value"
      :class="{ 'flex-1': checkboxComponent !== 'FormCheckbox' }"
      :label="option.label"
      :value="option.value"
      :modelValue="isSelected(option.value)"
      :customColor="option.customColor"
    />
  </div>
</template>

<script setup lang="ts">
import useFormCheckboxRadio from "~/composables/useFormCheckboxRadio";

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

  /**
   * The optional checkbox button custom color.
   */
  customColor?: string;
};

export interface Props {
  name: string;
  options: CheckboxOption[];
  modelValue: string | string[];
  style?: string;
  searchInput?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  style: "btn",
  searchInput: false,
});

const checkboxComponent = computed(() => {
  return props.style === "btn" ? "FormCheckboxBtn" : "FormCheckbox";
});

const emit = defineEmits(["update:modelValue"]);

const { isSelected, toggleCheckbox } = useFormCheckboxRadio(
  props.modelValue,
  emit
);
</script>
