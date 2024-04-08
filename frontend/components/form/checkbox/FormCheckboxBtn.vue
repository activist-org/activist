<template>
  <div
    class="relative flex h-9 items-center border border-r-0 border-light-interactive font-bold first:rounded-l-md last:rounded-r-md last:border-r dark:border-dark-interactive"
    :class="{
      'bg-light-menu-selection text-light-layer-1 dark:bg-dark-menu-selection dark:text-dark-layer-1':
        modelValue && !customColor,
      [customColorClass]: modelValue && customColor,
      'bg-light-layer-2 text-light-distinct-text dark:bg-dark-layer-2 dark:text-dark-distinct-text':
        !modelValue,
      'hover:bg-light-hover dark:hover:bg-dark-hover': !modelValue,
    }"
  >
    <input
      :id="uuid"
      class="hidden"
      type="checkbox"
      v-bind="{ ...$attrs, onChange: updateValue }"
      :checked="modelValue"
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
const uuid = uuidv4();
const customColorClass =
  props.customColor !== ""
    ? `bg-light-${props.customColor}/60 dark:bg-dark-${props.customColor}/10 dark:text-dark-${props.customColor}`
    : "";
</script>

<style scoped>
/* Define hover styles for the light theme */
.hover:bg-light-hover:hover {
  background-color: #ffdd00; /* Change this to your desired color */
}

/* Define hover styles for the dark theme */
.dark:hover:bg-dark-hover:hover {
  background-color: #333333; /* Change this to your desired color */
}
</style>
