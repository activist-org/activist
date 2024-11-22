<template>
  <div
    class="relative flex h-9 items-center border border-r-0 border-interactive font-bold first:rounded-l-md last:rounded-r-md last:border-r"
    :class="{
      'bg-menu-selection text-layer-1': modelValue && !customColor,
      [customColorClass]: modelValue && customColor,
      'bg-layer-2 text-distinct-text': !modelValue,
      'hover:bg-hover': !modelValue,
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
    ? `bg-${props.customColor}/60 dark:bg-${props.customColor}/10 dark:text-${props.customColor}`
    : "";
</script>

<style scoped>
/* Define hover styles for the light theme */
.hover:bg-hover:hover {
  background-color: #ffdd00; /* Change this to your desired color */
}

/* Define hover styles for the dark theme */
.dark:hover:bg-hover:hover {
  background-color: #333333; /* Change this to your desired color */
}
</style>
