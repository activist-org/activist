<template>
  <div class="relative flex flex-row items-center justify-start">
    <input
      class="cursor-pointer mb-0 peer appearance-none w-[1.375rem] h-[1.375rem] border border-light-text rounded-sm bg-light-button dark:bg-dark-button dark:border-dark-text"
      type="checkbox"
      v-bind="{ ...$attrs, onChange: updateValue }"
      :checked="modelValue === value"
      :id="uuid"
    />
    <div
      class="pointer-events-none w-[1rem] h-[1rem] top-[50%] translate-y-[-50%] hidden absolute left-[0.2rem] bg-light-text dark:bg-dark-text peer-checked:block rounded-sm"
    ></div>
    <label
      class="cursor-pointer ml-2 text-lg select-none"
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

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [Boolean],
  },
  value: {
    type: [String, Number],
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
const { updateValue } = useFormInput(props, emit);

const uuid = useUniqueID().getID().toString();
</script>
