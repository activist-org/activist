<template>
  <div
    class="relative flex items-center w-full h-10 font-bold border first:rounded-l-md last:rounded-r-md border-light-interactive dark:border-dark-interactive bg-light-header text-light-special-text dark:text-dark-special-text dark:bg-dark-header"
    :class="{
      'bg-dark-header dark:bg-dark-menu-selection text-dark-interactive dark:text-dark-distinct border-dark-header ':
        modelValue === value,
      customColorClass: modelValue === value,
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
      class="absolute flex items-center justify-center w-full h-full cursor-pointer select-none"
      v-if="label"
      :for="uuid"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import useFormInput from "../../composables/useFormSetup";
import useUniqueID from "../../composables/useUniqueID";

export interface Props {
  label?: string;
  modelValue?: [string, number];
  value?: [string, number];
  error?: string;
  customColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  error: "",
});

const emit = defineEmits(["update:modelValue"]);
const { updateValue } = useFormInput(props, emit);
const uuid = useUniqueID().getID().toString();
const customColorClass = props.customColor
  ? `text-white border-light-${props.customColor} dark:border-dark-${props.customColor} dark:bg-dark-${props.customColor} bg-light-${props.customColor}`
  : "";
</script>
