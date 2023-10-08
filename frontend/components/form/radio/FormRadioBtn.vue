<template>
  <div
    class="relative flex items-center w-full h-9 font-bold border first:rounded-l-md last:rounded-r-md border-light-interactive dark:border-dark-interactive"
    :class="{
      'bg-light-menu-selection dark:bg-dark-menu-selection text-light-distinct dark:text-dark-distinct':
        modelValue === value && !customColor,
      [customColorClass]: modelValue === value && customColor,
      'bg-light-header text-light-special-text dark:text-dark-special-text dark:bg-dark-header':
        modelValue !== value,
    }"
  >
    <input
      class="hidden"
      type="radio"
      v-bind="{ ...$attrs, onChange: updateValue }"
      :checked="modelValue === value"
      :id="uuid"
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
import useFormInput from "../../../composables/useFormSetup";
import useUniqueID from "../../../composables/useUniqueID";

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
const uuid = useUniqueID().getID().toString();
const customColorClass =
  props.customColor !== ""
    ? `bg-light-${props.customColor}/60 dark:bg-dark-${props.customColor}/10 dark:text-dark-${props.customColor}`
    : "";
</script>
