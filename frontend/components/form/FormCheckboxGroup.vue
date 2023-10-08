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

export interface Props {
  modelValue: string | string[];
  options: CheckboxOption[];
  name: string;
  style?: string;
  searchInput?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  style: "button",
  searchInput: false,
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
